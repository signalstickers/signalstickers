import { style, globalStyle } from '@vanilla-extract/css';

import { DARK_THEME_BACKGROUND } from 'etc/colors';
import { NAVBAR_HEIGHT } from 'etc/constants';


/**
 * These styles turn Bootstrap's .modal class into a custom backdrop that does
 * not cover the navbar. We then hide Bootstrap's .modal-backdrop element when
 * the component is mounted.
 */


const classes = {
  nsfwModal: style({
    marginTop: `${NAVBAR_HEIGHT}px`,
    marginBottom: `${NAVBAR_HEIGHT}px`,
    // N.B. In browsers without backdrop-filter support this should be set to 1.
    background: 'rgba(255, 255, 255, 0.75)',
    backdropFilter: 'blur(20px)'
  })
};

globalStyle(`${classes.nsfwModal} .modal-dialog`, {
  minHeight: `calc(100% - ${Number(NAVBAR_HEIGHT)}px)`,
  margin: `0 auto ${NAVBAR_HEIGHT}px auto`
});

globalStyle(`${classes.nsfwModal} .modal-dialog:before`, {
  height: 0
});

globalStyle(`${classes.nsfwModal} .modal-content`, {
  borderColor: 'rgba(0, 0, 0, 0.12)',
  boxShadow: '0px 0px 32px 0px rgba(0, 0, 0, 0.12)'
});

globalStyle(`${classes.nsfwModal} svg`, {
  transform: 'translateY(-2px)'
});

globalStyle(`.theme-dark .${classes.nsfwModal}`, {
  transform: 'translateY(-2px)'
});

globalStyle(`.theme-dark .${classes.nsfwModal}`, {
  // N.B. In browsers without backdrop-filter support this should be set to 1.
  background: 'rgba(42, 42, 42, 0.75)'
});

globalStyle(`.theme-dark .${classes.nsfwModal} .modal-content`, {
  backgroundColor: DARK_THEME_BACKGROUND,
  color: 'var(--white)'
});


export default classes;
