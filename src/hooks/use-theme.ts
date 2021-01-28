/**
 * Returns the string 'light' if the light theme is in use and 'dark' if the
 * dark theme is in use.
 */
export default function useTheme() {
  const bodyEls = document.querySelectorAll('body');

  if (bodyEls.length > 1) {
    throw new Error('[useTheme] Found more than 1 <body> element in the DOM.');
  }

  const bodyEl = bodyEls[0];

  if (bodyEl.classList.contains('theme-light')) {
    return 'light';
  }

  if (bodyEl.classList.contains('theme-dark')) {
    return 'dark';
  }

  throw new Error('[useTheme] Unknown theme.');
}
