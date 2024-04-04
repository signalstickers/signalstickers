/**
 * Mapping of Bootstrap 5 breakpoint names to their minWidths.
 * See: https://getbootstrap.com/docs/5.3/layout/breakpoints/#available-breakpoints
 */
export const BOOTSTRAP_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};


/**
 * Value of the query parameter used to track the current search query.
 */
export const SEARCH_QUERY_PARAM = 's';


/**
 * Regular expression used to validate signal.art URLs for sticker packs, with
 * groups [_, pack_id, pack_key]
 */
export const SIGNAL_ART_URL_PATTERN = /^https:\/\/signal.art\/addstickers\/#pack_id=([\dA-Za-z]{32})&pack_key=([\dA-Za-z]{64})$/g;


/**
 * Regular expression used to validate pack IDs from URL parameters.
 */
export const PACK_ID_PATTERN = /^[\dA-Za-z]{32}$/g;


/**
 * API URLs.
 */
export const API_BASE_URL = import.meta.env.SIGNALSTICKERS_API_URL;
export const API_URL_CONTRIBUTION_REQUEST = `${API_BASE_URL}/contributionrequest/`;
export const API_URL_CONTRIBUTE = `${API_BASE_URL}/contribute/`;
export const API_URL_PACKS = `${API_BASE_URL}/packs/`;
export const API_URL_PACKS_PING = `${API_BASE_URL}/ping/`;
export const API_URL_STATUS = `${API_BASE_URL}/packs/status/`;
export const API_URL_REPORT = `${API_BASE_URL}/report/`;
