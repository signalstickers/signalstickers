import { style, globalStyle } from '@vanilla-extract/css';

import { DARK_THEME_BACKGROUND } from 'etc/colors';


const classes = {
  container: style({
    display: 'flex',
    flexGrow: 1
  })
};

globalStyle(`.theme-light ${classes.container}`, {
  backgroundColor: 'var(--white)',
  color: 'var(--dark)'
});

globalStyle(`.theme-dark ${classes.container}`, {
  backgroundColor: DARK_THEME_BACKGROUND,
  color: 'var(--light)'
});


export default classes;
