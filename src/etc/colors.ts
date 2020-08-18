import {darken, lighten, saturate} from 'polished';


/**
 * Saturated version of Bootstrap's --danger color.
 */
export const DANGER_SATURATED = saturate(0.2, '#DC3545');


/**
 * Darker version of Bootstrap's --gray color.
 */
export const GRAY_DARKER = darken(0.1, '#6C757D');


/**
 * (Even) darker version of Bootstrap's --gray color.
 */
export const GRAY_DARKER_2 = darken(0.255, '#6C757D');


/**
 * Lighter version of Bootstrap's --gray color.
 */
export const GRAY_LIGHTER = lighten(0.18, '#6C757D');


/**
 * Darker version of Bootstrap's --primary color.
 */
export const PRIMARY_DARKER = darken(0.15, '#007BFF');


/**
 * Lighter version of Bootstrap's --primary color.
 */
export const PRIMARY_LIGHTER = lighten(0.2, '#007BFF');


/**
 * Darker version of Bootstrap's --gray-dark color.
 *
 * Used as the background color for primary content containers in dark mode.
 */
export const DARK_THEME_BACKGROUND = darken(0.01, '#343A40');
