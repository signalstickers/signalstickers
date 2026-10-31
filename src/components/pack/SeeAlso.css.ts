import { globalStyle, style } from '@vanilla-extract/css';

import { GRAY_DARKER } from 'etc/colors';


const classes = {
  seeAlso: style({
    borderTop: '1px solid rgba(0, 0, 0, 0.125)',
    marginTop: '48px',
    paddingTop: '24px'
  }),
  sectionTitle: style({
    fontSize: '1.5rem',
    marginBottom: '16px'
  })
};

globalStyle(`.theme-dark ${classes.seeAlso}`, {
  borderColor: GRAY_DARKER
});


export default classes;
