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
 * collection. Users may also perform a fuzzy search on a specific attribute
 * using the following grammar:
 *
 * '<attribute>:<query>'
 *
 * If `query` contains whitespace, the <query> portion must be wrapped in double
 * quotes:
 *
 * '<attribute>:"<query>"'
 *
 * Queries may include any combination of attribute selectors as well as general
 * search terms:
 *
 * '<term> <term> <attribute>:<query> <attribute>:"<query>" <term>'
 *
 * Our implementation will combine each term with an AND operator, meaning a
 * result must match ALL terms.
 *
 * -----------------------------------------------------------------------------
 *
 * See: https://fusejs.io/
 */
import Fuse, {
  type Expression,
  type FuseResult,
  type FuseOptionKeyObject
} from 'fuse.js';
import * as R from 'ramda';


/**
 * A Fuse.js "and" expression object.
 *
 * See: https://www.fusejs.io/api/query.html#and
 */
interface AndExpression {
  $and: Array<Expression>;
}


/**
 * Object containing an optional fuzzy query that will be used to search across
 * all attributes and an optional `AndExpression`.
 * query.
 */
export interface QueryObject {
  query?: string;
  expression?: AndExpression;
}


/**
 * Utility type that, provided the member type of a collection, represents a
 * collection of search results.
 */
export type SearchResults<T> = Array<FuseResult<T>>;


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
  keys: Array<FuseOptionKeyObject<T>>;
}


/**
 * Object returned by SearchFactory.
 *
 * See: https://www.fusejs.io/api/query.html#logical-query-operators
 */
export interface Searcher<T> {
  /**
   * Provided a query string, performs a search on `collection` and returns a
   * result set.
   */
  search: (queryString: string) => SearchResults<T>;

  /**
   * Provided a query string, returns a `QueryObject` object.
   *
   * @example
   *
   * searcher.parseQueryString(`tag:cute doge amaze`) // =>
   * {
   *   query: 'doge amaze',
   *   expression: {
   *     $and: [{ tag: 'cute' }]
   *   }
   * }
   */
  parseQueryString: (query: string) => QueryObject;

  /**
   * Provided a `QueryObject`, returns a query string.
   *
   * @example
   *
   * searcher.buildQueryString({
   *   query: 'elephant',
   *   expression: {
   *     $and: [{ tag: 'animal', tag: 'for children' }]
   *   }
   * }) //=>
   * 'elephant tag:animal tag:"for children"'
   */
  buildQueryString: (queryObject: QueryObject) => string;
}


/**
 * Maximum 'score' a search result can have. Results with a higher score will
 * be filtered-out.
 *
 * N.B. With Fuse.js, a score of 0 represents a perfect match, and a score of 1
 * represents a result that did not match anything in the query.
 */
const MAX_SCORE = 0.01;


/**
 * Maximum score search results can have when using a our "tokenized OR" query.
 * This score is lower than the general maximum score to reduce noisy results
 * that can come from this query, which is very permissive.
 *
 * See usage below for more context.
 */
// const MAX_SCORE_GENERAL_OR = 0.000_000_000_001;
const MAX_SCORE_GENERAL_OR = 0.000_000_01;


/**
 * Matches a quoted attribute search expression. This format is used when the
 * query contains whitespace.
 *
 * Ex: `author:"Frodo Baggins"`
 */
const QUOTED_EXPRESSION_PATTERN = /(?<attribute>[^\s":]+):"(?<query>[^":]+)"/g;


/**
 * Matches an unquoted attribute search expression.
 *
 * Ex: `tag:cute`
 */
const UNQUOTED_EXPRESSION_PATTERN = /(?<attribute>[^\s":]+):(?<query>[^\s":]+)/g;


/**
 * Provided a SearchFactoryOptions object, returns a Search object.
 */
export default function SearchFactory<T>(options: SearchFactoryOptions<T>): Searcher<T> {
  /**
   * @private
   *
   * Fuse instance.
   *
   * See: https://www.fusejs.io/api/options.html
   */
  const fuse = new Fuse(options.collection, {
    isCaseSensitive: false,
    includeScore: true,
    ignoreLocation: true,
    findAllMatches: true,
    minMatchCharLength: 2,
    shouldSort: false,
    threshold: 0.4,
    keys: options.keys
  });


  // ----- Private Methods -----------------------------------------------------

  /**
   * @private
   *
   * Provided a string, returns the number of words therein.
   */
  const wordCount = (input: string): number => input.split(/\s+/g).length;


  /**
   * @private
   *
   * Type predicate used to determine if a given `FuseExpression` is an "and"
   * expression.
   */
  const isAndExpression = (value: any): value is AndExpression => R.has('$and', value);


  /**
   * Returns true if the provided attribute was enumerated in the searcher's
   * `keys` configuration.
   */
  const isValidAttribute = (attribute: string | Array<string>) => {
    return R.any(R.propEq(attribute, 'name'), options.keys);
  };


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
      R.uniqBy<FuseResult<T>, any>(result => options.identity(result.item))
    )(results);
  };


  // ----- Public Methods ------------------------------------------------------

  const parseQueryString = (queryString: string): QueryObject => {
    const expression: AndExpression = { $and: [] };

    let remainingQuery = queryString;

    R.forEach((curPattern: RegExp) => {
      if (remainingQuery.length === 0) return;

      R.forEach((match: RegExpMatchArray) => {
        if (!match.groups) return;

        const attribute = match.groups.attribute.trim();
        const query = match.groups.query.trim();

        // Remove the matched term from the query string.
        remainingQuery = remainingQuery.replace(match[0], '').trim();

        // If the attribute matched from the query string does not match a
        // configured attribute, do not add it to our expression.
        if (!isValidAttribute(attribute)) {
          console.warn('[parseQueryString] Invalid attribute:', attribute);
          return;
        }

        expression.$and.push({ [attribute]: query });
      }, [...remainingQuery.matchAll(curPattern)]);
    }, [
      UNQUOTED_EXPRESSION_PATTERN,
      QUOTED_EXPRESSION_PATTERN
    ]);

    return {
      query: remainingQuery,
      expression
    };
  };


  const buildQueryString = (queryObject: QueryObject): string => {
    const queryTerms: Array<string> = [];

    if (queryObject.query) queryTerms.push(queryObject.query);

    if (isAndExpression(queryObject.expression)) {
      R.forEachObjIndexed(expressionTerms => {
        R.forEach(([attribute, query]) => {
          if (!isValidAttribute(attribute)) return;
          const formattedQuery = wordCount(query) > 1 ? `"${query}"` : query;
          queryTerms.push(`${attribute}:${formattedQuery}`);
        }, R.toPairs(expressionTerms as Record<string, string>));
      }, queryObject.expression.$and);
    }

    return R.join(' ', queryTerms);
  };


  const search = R.memoizeWith(R.identity, (queryString: string) => {
    const results = [];
    const { expression, query } = parseQueryString(queryString);

    if (query) {
      // Build an expression that takes our search query, splits it into tokens
      // (by space), then creates a list of key/token pairs joined into an OR
      // expression. For more information on why we have to do this, see:
      // https://github.com/krisk/Fuse/issues/302
      // https://github.com/krisk/Fuse/issues/235
      const orExpression = R.chain(keyDescriptor => {
        const keyName = Array.isArray(keyDescriptor.name)
          ? keyDescriptor.name.join('.')
          : keyDescriptor.name;

        return R.map(token => ({ [keyName]: token }), R.split(' ', queryString));
      }, options.keys);

      results.push(...fuse.search({ $or: orExpression })
        .filter(result => result.score && result.score <= MAX_SCORE_GENERAL_OR));

      // Then, perform a "regular" search.
      results.push(...fuse.search(query));
    }

    if (expression) results.push(...fuse.search(expression));

    const finalResults = processResults(results);

    console.log('RESULTS', finalResults);

    return finalResults;
  });


  return {
    search,
    parseQueryString,
    buildQueryString
  };
}
