import { style, globalStyle } from '@vanilla-extract/css';

import { bp } from 'lib/utils';


globalStyle('*, *:before, *:after', {
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale'
});

globalStyle('html', {
  display: 'flex',
  flexDirection: 'column',
  // This must be "lvh" in order for the element to cover the entire screen in
  // PWA/standalone mode.
  minHeight: '100lvh',
  margin: 0,
  padding: 0,
  overscrollBehaviorY: 'none',
  // Sets the default font size (1rem) used by Bootstrap.
  fontSize: '14px'
});

globalStyle('body', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  margin: 0,
  fontWeight: 400,
  overscrollBehaviorY: 'none',
  // This sets the minimum size for _most_ text in the app to about 16px, but
  // the above setting still lets us use .fs-6 to set a font size of 14px/1rem.
  fontSize: '1.2rem',
  fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif'
});

globalStyle('a', {
  color: 'var(--bs-primary)',
  textDecoration: 'none'
});

globalStyle('#root', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1
});

// Use a slightly darker-than-white background color for the document in light
// mode. This affords us the option to use true white for emphasis when
// necessary.
globalStyle('[data-bs-theme="light"] body', {
  backgroundColor: 'var(--bs-gray-100)'
});

// Adds an additional font size class to Bootstrap's .fs-N utilities to achieve
// a font size of ~12px. This should be used very sparingly.
// See: https://getbootstrap.com/docs/5.3/utilities/text/#font-size
globalStyle('.fs-7', {
  fontSize: '0.86rem !important'
});

// Add to elements to easily debug sizing / positioning issues without affecting
// the element's size, position, or existing border.
globalStyle('.debug', {
  boxShadow: '0px 0px 0px 2px rgba(255, 0, 0, 0.72) inset'
});

// Allows us to easily apply padding that will ensure content is rendered in
// the safe area of the viewport.
// See: https://developer.mozilla.org/en-US/docs/Web/CSS/env#safe-area-inset-top
globalStyle('.safe-area-padding', {
  paddingTop: 'env(safe-area-inset-top, 0px)',
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  paddingLeft: 'env(safe-area-inset-left, 0px)',
  paddingRight: 'env(safe-area-inset-right, 0px)'
});

globalStyle('.safe-area-padding-top', {
  paddingTop: 'env(safe-area-inset-top, 0px)'
});

globalStyle('.safe-area-padding-left', {
  paddingLeft: 'env(safe-area-inset-left, 0px)'
});

globalStyle('.safe-area-padding-bottom', {
  paddingBottom: 'env(safe-area-inset-bottom, 0px)'
});

globalStyle('.safe-area-padding-right', {
  paddingRight: 'env(safe-area-inset-right, 0px)'
});

// Hide the error overlay (only shown in development). Disable this temporarily
// if you wish to use it.
globalStyle('vite-plugin-checker-error-overlay', { display: 'none' });


export default {
  /**
  * N.B. We use CSS Grid here rather than the Bootstrap grid because it allows
  * us to specify odd numbers of identically-sized columns, which we cannot do
  * in Bootstrap's 12-column grid.
  */
  gridView: style({
    display: 'grid',
    gridGap: '1rem',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    justifyContent: 'space-between',
    '@media': {
      [bp('sm')]: {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
      },
      [bp('md')]: {
        gridGap: '1.5rem',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
      },
      [bp('lg')]: {
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'
      },
      [bp('xl')]: {
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))'
      },
      [bp('xxl')]: {
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))'
      }
    }
  })
};
