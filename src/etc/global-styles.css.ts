import { globalStyle } from '@vanilla-extract/css';
import { rgba } from 'polished';

import {
  GRAY_LIGHTER,
  GRAY_DARKER,
  GRAY_DARKER_2,
  PRIMARY_LIGHTER
} from 'etc/colors';


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
  height: '100%',
  margin: 0,
  padding: 0,
  paddingTop: 'env(safe-area-inset-top, 0px)'
});

globalStyle('body', {
  fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  fontSize: '16px',
  fontWeight: 400,
  height: '100%',
  margin: 0,
  padding: 0
});

globalStyle('a', {
  color: 'var(--primary)',
  textDecoration: 'none'
});

globalStyle('#root', {
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'calc(100vh - env(safe-area-inset-top, 0px))'
});

globalStyle('.theme-light .form-control:not(.is-invalid)', {
  borderColor: ' rgba(0, 0, 0, 0.125)'
});

globalStyle('.theme-light .form-control:not(.is-invalid):focus', {
  boxShadow: `0 0 0 0.15rem ${rgba(GRAY_LIGHTER, 0.25)}`
});

globalStyle('.theme-dark .btn-light', {
  backgroundColor: 'var(--gray-dark)',
  borderColor: GRAY_DARKER,
  color: 'var(--light)'
});

globalStyle('.theme-dark .btn-light:hover', {
  backgroundColor: GRAY_DARKER_2,
  color: 'var(--light)'
});

globalStyle('.theme-dark .btn-light:active:focus', {
  backgroundColor: GRAY_DARKER_2,
  color: 'var(--light)'
});

globalStyle('.theme-dark .btn-light', {
  backgroundColor: 'var(--gray-dark)',
  borderColor: GRAY_DARKER,
  color: 'var(--light)'
});

globalStyle('.theme-dark .btn-light:hover', {
  backgroundColor: GRAY_DARKER_2,
  color: 'var(--light)'
});

globalStyle('.theme-dark .btn-light:active:focus', {
  backgroundColor: GRAY_DARKER_2,
  color: 'var(--light)'
});

globalStyle('.theme-dark .btn-primary', {
  color: 'var(--light)'
});

globalStyle('.theme-dark .btn-primary:hover', {
  color: 'var(--light)'
});

globalStyle('.theme-dark .btn-success:hover', {
  color: 'var(--light)'
});

globalStyle('.theme-dark .btn-secondary', {
  backgroundColor: 'var(--secondary)'
});

globalStyle('.theme-dark .card', {
  backgroundColor: GRAY_DARKER_2,
  borderColor: GRAY_DARKER,
  boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.15)'
});

globalStyle('.theme-dark .form-control', {
  backgroundColor: GRAY_DARKER_2,
  color: 'inherit'
});

globalStyle('.theme-dark .form-control:not(.is-valid)', {
  borderColor: GRAY_DARKER
});

globalStyle('.theme-dark .form-control:not(.is-valid):focus', {
  borderColor: GRAY_LIGHTER,
  boxShadow: `0 0 0 0.15rem ${rgba(GRAY_LIGHTER, 0.25)}`
});

globalStyle('.theme-dark .modal-header', {
  borderColor: GRAY_DARKER
});

globalStyle('.theme-dark .modal-footer', {
  borderColor: GRAY_DARKER
});

/* !important is needed here because Bootstrap uses it as well. */
globalStyle('.theme-dark .text-dark', {
  color: 'var(--light) !important'
});

globalStyle('.theme-dark .text-muted', {
  color: `${GRAY_LIGHTER} !important`
});

globalStyle('.theme-dark a, .theme-dark .btn.btn-link', {
  color: 'var(--primary)'
});

globalStyle('.theme-dark a:hover, .theme-dark .btn.btn-link:hover', {
  color: PRIMARY_LIGHTER
});

globalStyle('.theme-dark hr', {
  borderColor: GRAY_DARKER
});

globalStyle('.theme-dark pre', {
  color: 'var(--light)'
});

globalStyle('legend', {
  fontSize: '1em'
});
