/**
 * Maximum 'score' a search result can have. Results with a higher score will
 * be filtered-out.
 *
 * N.B. With Fuse.js, a score of 0 represents a perfect match, and a score of 1
 * represents a result that did not match anything in the query.
 */
export const MAX_SCORE = 0.6;


/**
 * Matches a quoted attribute search expression. This format is used when the
 * query contains whitespace.
 *
 * Ex: `author:"Frodo Baggins"`
 */
export const QUOTED_EXPRESSION_PATTERN = /(?<attribute>[^\s":]+):"(?<query>[^":]+)"/g;


/**
 * Matches an unquoted attribute search expression.
 *
 * Ex: `tag:cute`
 */
export const UNQUOTED_EXPRESSION_PATTERN = /(?<attribute>[^\s":]+):(?<query>[^\s":]+)/g;
