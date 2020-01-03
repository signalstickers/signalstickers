/**
 * This will serve us the JSON file at https://github.com/romainricard/signalstickers/blob/master/stickers.json
 * but will apply reasonable caching and free distribution. By loading the
 * manifest in this way, we do not need to re-deploy the client as new packs are
 * added; they should appear in clients as soon as their cache is invalidated.
 */
export const STICKERS_MANIFEST_URL = 'https://cdn.jsdelivr.net/gh/romainricard/signalstickers/stickers.json';


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
