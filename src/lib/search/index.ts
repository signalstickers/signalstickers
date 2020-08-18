/**
 * ===== Search ================================================================
 *
 * This module provides a fuzzy searching facility that supports broad as well
 * as targeted queries. It must be configured with a collection of
 * uniformly-shaped objects. These objects should contain at least 1 key that
 * may be used to uniquely identify them.
 *
 * Query Grammar
 * -------------
 *
 * A simple query will perform a fuzzy search on all configured attributes in a
 * collection. Users may also perform a query on a specific attribute using the
 * following grammar:
 *
 * '<attribute>:<query>'
 *
 * If `query` contains whitespace, the <query> portion may be wrapped in double
 * quotation marks:
 *
 * '<attribute>:"<query>"'
 *
 * Queries may include any combination of attribute selectors as well as general
 * search terms:
 *
 * '<term> <term> <attribute>:<query> <attribute>:"<query>" <term>'
 *
 * -----------------------------------------------------------------------------
 *
 * See: https://fusejs.io/
 */
import Fuse from 'fuse.js';
import * as R from 'ramda';

import {
  BASE_CONFIG,
  GENERAL_SEARCHER,
  MAX_SCORE,
  QUOTED_EXPRESSION_PATTERN,
  UNQUOTED_EXPRESSION_PATTERN
} from './constants';
import {
  AttributeQuery,
  ParsedQuery
} from './types';


/**
 * Utility type that, provided the member type of a collection, represents a
 * collection of search results.
 */
export type SearchResults<T> = Array<Fuse.FuseResult<T>>;


/**
 * Options object accepted by SearchFactory.
 */
export interface SearchFactoryOptions<T> {
  /**
   * Collection to search on. Each item in the collection should be of the same
   * type.
   */
  collection: Array<T>;

  /**
   * Function that will be invoked when checking whether two items should be
   * considered equal. The function will be passed an item from the collection
   * and should return a primitive value used for comparison (ex: ID).
   */
  identity: (item: T) => string | number | boolean | undefined;

  /**
   * Mapping of attribute shorthand terms (used in search queries) to arrays
   * representing paths where that attribute can be found in each item in the
   * collection. Single mappings are used for attribute queries, and all
   * attributes are included when performing general queries.
   *
   * See: https://fusejs.io/examples.html#nested-search
   */
  keys: {
    [key: string]: Fuse.FuseOptionKey;
  };
}


/**
 * Object returned by SearchFactory.
 */
export interface Search<T> {
  /**
   * Provided a query string, performs a search on `collection` and returns a
   * result set.
   */
  search: (queryString: string) => SearchResults<T>;

  /**
   * Provided a query string, returns a query object.
   *
   * @example
   *
   * searcher.parseQueryString(`tag:cute doge amaze`) //=> {
   *   query: 'doge amaze',
   *   attributeQueries: [
   *     {tag: 'cute'}
   *   ]
   * }
   */
  parseQueryString: (query: string) => ParsedQuery;

  /**
   * Provided a query object, returns a query string.
   *
   * @example
   *
   * searcher.buildQueryString({
   *   query: 'elephant',
   *   attributeQueries: [
   *     {tag: 'animal'},
   *     {tag: 'for children'}
   *   ]
   * }) //=> 'elephant tag:animal tag:"for children"'
   */
  buildQueryString: (queryObject: ParsedQuery) => string;
}


/**
 * Provided a SearchFactoryOptions object, returns a Search object.
 */
export default function SearchFactory<T>(options: SearchFactoryOptions<T>): Search<T> {

  // ----- Private Members -----------------------------------------------------

  /**
   * @private
   *
   * Keep a cache of Fuse instances for each attribute that we search on. This
   * prevents unnecessary re-indexing.
   */
  const searchers = new Map<string | number | symbol, Fuse<T>>();


  // ----- Private Methods -----------------------------------------------------

  /**
   * @private
   *
   * Custom Fuse.js "getter" function that will be invoked when traversing paths
   * in collection members. The function is responsible for returning the value
   * at the indicated path which, per Fuse requirements, must be a string or an
   * array of strings. By using a custom function, we can type-cast non-string
   * values to strings for the purposes of matching search results. This will
   * allow the user to use attribute queries such as 'original:true' or
   * 'nsfw:false'.
   */
  const customGetFn = (item: T, path: string | Array<string>) => {
    const value = R.path(Array.isArray(path) ? path : R.split('.', path), item);
    const valueType = R.type(value);

    switch (valueType) {
      case 'String':
        return String(value);
      case 'Array':
        return value as Array<string>;
      // Cast booleans and numbers using the String constructor, yielding
      // results like 'true', 'false'.
      case 'Boolean':
      case 'Number':
        return String(value);
      // For bottom values, return 'false'. This allows queries on attributes
      // where the absence of that attribute implies `false`, such as 'nsfw' and
      // 'original'.
      case 'Null':
      case 'Undefined':
        return 'false';
      default:
        throw new Error(`[Search::getFn] Unable to parse value of type "${valueType}" at path "${String(path)}".`);
    }
  };


  /**
   * @private
   *
   * Provided a string, returns the number of words therein.
   */
  const wordCount = (input: string): number => input.split(/\s+/g).length;


  /**
   * @private
   *
   * Filters and de-dupes search results that are collected from multiple Fuse
   * instances.
   */
  const processResults = (results: SearchResults<T>): SearchResults<T> => {
    return R.compose(
      // Filter-out results with a score above MAX_SCORE.
      R.filter(R.compose(R.gte(MAX_SCORE), R.propOr(undefined, 'score'))),
      // De-dupe results by calling the configured identity callback.
      R.uniqBy<Fuse.FuseResult<T>, any>(result => options.identity(result.item))
    )(results);
  };


  /**
   * @private
   *
   * Create Fuse instances for each configured attribute as well as a general
   * instance that searches across all configured attributes.
   */
  const createFuseInstances = (collection: Array<T>) => {
    R.forEach(([attribute, path]) => {
      searchers.set(attribute, new Fuse(collection, {
        ...BASE_CONFIG,
        getFn: customGetFn,
        keys: [path]
      }));
    }, R.toPairs(options.keys ?? []));

    searchers.set(GENERAL_SEARCHER, new Fuse(collection, {
      ...BASE_CONFIG,
      getFn: customGetFn,
      keys: R.values(options.keys)
    }));
  };


  // ----- Public Methods ------------------------------------------------------

  const parseQueryString = (query: string): ParsedQuery => {
    let remainingQuery = query;
    const attributeQueries: Array<AttributeQuery> = [];

    R.forEach(curPattern => {
      if (remainingQuery.length === 0) {
        return;
      }

      R.forEach(match => {
        if (!match.groups) {
          return;
        }

        const attribute = match.groups.attribute.trim();
        const query = match.groups.query.trim();

        // Determine if the provided attribute is valid by checking if we have
        // a dedicated searcher for it.
        const isValidAttribute = searchers.has(attribute);

        // If 'attribute' matched from the query string does not match a
        // configured attribute, leave the entire term in the query string,
        // allowing it to be used as a general search term.
        if (!isValidAttribute) {
          return;
        }

        // Remove the matched term from the query string.
        remainingQuery = remainingQuery.replace(match[0], '').trim();

        attributeQueries.push({[attribute]: query});
      }, [...remainingQuery.matchAll(curPattern)]);
    }, [
      UNQUOTED_EXPRESSION_PATTERN,
      QUOTED_EXPRESSION_PATTERN
    ]);

    return {
      query: remainingQuery.trim(),
      attributeQueries
    };
  };


  const buildQueryString = (queryObject: ParsedQuery): string => {
    const queryTerms: Array<string> = [];

    R.forEach(R.forEachObjIndexed((query, attribute) => {
      const isValidAttribute = searchers.has(attribute);

      if (!isValidAttribute) {
        throw new Error(`[Search::buildQueryString] Unknown attribute: "${attribute}".`);
      }

      const formattedQuery = wordCount(query) > 1 ? `"${query}"` : query;
      queryTerms.push(`${attribute}:${formattedQuery}`);
    }), queryObject.attributeQueries ?? []);

    return R.join(' ', R.prepend(queryObject.query, queryTerms)).trim();
  };


  const search = R.memoizeWith(R.identity, (queryString: string) => {
    let results: SearchResults<T> = [];
    const {query, attributeQueries} = parseQueryString(queryString);

    // Perform an attribute search for each attribute query.
    R.forEach(R.forEachObjIndexed((attributeQuery, attribute) => {
      if (!attributeQuery) {
        return;
      }

      const searcherForAttribute = searchers.get(attribute);

      if (!searcherForAttribute) {
        return;
      }

      const resultsForAttribute = searcherForAttribute.search(attributeQuery);

      if (results.length === 0) {
        // If this is the first query that produced results, set results array
        // directly.
        results = resultsForAttribute;
      } else {
        // Otherwise, only add those results from this attribute search that are
        // _also_ in the existing result set. This effectively gives us a
        // logical "and" when handling multiple attribute queries.
        results = R.innerJoin((a, b) => {
          return options.identity(a.item) === options.identity(b.item);
        }, results, resultsForAttribute);
      }
    }), attributeQueries ?? []);

    // Then, perform a search with the remaining portion of the query using the
    // general purpose Fuse instance.
    if (query) {
      const querySearcher = searchers.get(GENERAL_SEARCHER);

      if (querySearcher) {
        const queryResults = querySearcher.search(query);

        if (results.length === 0) {
          results = queryResults;
        } else {
          results = R.innerJoin((a, b) => {
            return options.identity(a.item) === options.identity(b.item);
          }, results, queryResults);
        }
      } else {
        throw new Error('[Search] Unable to find the generic searcher.');
      }
    }

    return processResults(results);
  });


  // ----- Initialization ------------------------------------------------------

  createFuseInstances(options.collection);


  return {
    search,
    parseQueryString,
    buildQueryString
  };
}
