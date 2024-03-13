import { style, globalStyle } from '@vanilla-extract/css';
import { darken } from 'polished';

import { PRIMARY_DARKER } from 'etc/colors';
import { NAVBAR_HEIGHT } from 'etc/constants';
import { bp } from 'lib/utils';


const classes = {
  navbar: style({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingBottom: '6px',
    paddingTop: '4px',
    minHeight: `${NAVBAR_HEIGHT}px`,
    '@media': {
      [bp('md')]: {
        maxHeight: `${NAVBAR_HEIGHT}px`
      }
    }
  })
};

/**
 * We need to fight with Bootstrap's specificity a little here, hence the
 * verbose selectors.
 */
globalStyle(`${classes.navbar}.navbar-dark .navbar-nav .nav-link`, {
  color: darken(0.07, 'white'),
  transition: 'color 0.15s ease',
  letterSpacing: '0.05em'
});

globalStyle(`${classes.navbar}.navbar-dark .navbar-nav .nav-link:active`, {
  color: 'white'
});

globalStyle(`${classes.navbar}.navbar-dark .navbar-nav .nav-link:hover`, {
  color: 'white'
});

globalStyle(`${classes.navbar}.navbar-dark .navbar-nav .nav-link svg`, {
  fill: darken(0.1, 'white'),
  transition: 'fill 0.15s ease'
});

globalStyle(`${classes.navbar}.navbar-dark .navbar-nav .nav-link svg:hover`, {
  fill: 'white'
});


// Creates a border between the navbar and menu items when open (on mobile).
globalStyle(`${classes.navbar} .container::before`, {
  content: '',
  display: 'block',
  position: 'absolute',
  width: '200vw',
  left: '-100vw',
  top: `${NAVBAR_HEIGHT + 1}px`,
  height: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.33)'
});

globalStyle(`${classes.navbar} .navbar-brand`, {
  fontSize: '24px',
  color: 'white',
  letterSpacing: '0.02em',
  padding: '7px 0'
});

globalStyle(`${classes.navbar} .navbar-brand:hover`, {
  color: 'white',
  textDecoration: 'none'
});

globalStyle(`${classes.navbar} .navbar-brand img`, {
  bottom: '2px',
  height: '1.5em',
  marginRight: '8px',
  position: 'relative',
  width: 'auto'
});

globalStyle(`${classes.navbar} .navbar-toggler`, {
  border: 'none',
  fontSize: '26px',
  paddingRight: '12px'
});

globalStyle(`${classes.navbar} .navbar-toggler:focus`, {
  outline: 'none'
});

globalStyle(`${classes.navbar} .menu-icon`, {
  fill: darken(0.1, 'white'),
  transform: 'scale(1.2) translateY(1px)'
});

globalStyle(`.theme-light ${classes.navbar}`, {
  backgroundColor: 'var(--primary)'
});

globalStyle(`.theme-dark ${classes.navbar}`, {
  backgroundColor: PRIMARY_DARKER
});

globalStyle(`.theme-dark ${classes.navbar} .navbar-brand img`, {
  filter: 'brightness(0.75)'
});


export default classes;
