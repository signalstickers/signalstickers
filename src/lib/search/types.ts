/**
 * Object used when parsing/un-parsing queries to indicate a search on a
 * specific attribute.
 *
 * Ex: `tag:cute` => {tag: 'cute'}
 */
export type AttributeQuery = {
  [key: string]: string;
};


/**
 * Object containing an array of valid attribute queries and/or a general search
 * query.
 */
export interface ParsedQuery {
  query?: string;
  attributeQueries?: Array<AttributeQuery>;
}
