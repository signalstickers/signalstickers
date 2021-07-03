/**
 * Mapping of Bootstrap 4 breakpoint names to their minWidths.
 */
export const BOOTSTRAP_BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
};


/**
 * Height of the navbar (px).
 */
export const NAVBAR_HEIGHT = 64;


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
 * API urls
 */
const API_BASE_URL = 'https://api.signalstickers.com/v1';

const API_URL_CONTRIBUTIONREQUEST = `${API_BASE_URL}/contributionrequest/`;
const API_URL_CONTRIBUTE = `${API_BASE_URL}/contribute/`;
const API_URL_PACKS = `${API_BASE_URL}/packs/`;
const API_URL_PACKS_PING = `${API_BASE_URL}/ping/`;
const API_URL_STATUS = `${API_BASE_URL}/packs/status/`;

export { API_BASE_URL, API_URL_PACKS, API_URL_PACKS_PING, API_URL_CONTRIBUTIONREQUEST, API_URL_CONTRIBUTE, API_URL_STATUS };
