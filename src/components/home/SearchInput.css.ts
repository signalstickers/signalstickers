import { style } from '@vanilla-extract/css';


const classes: Record<string, string> = {
  searchClear: style({
    transition: 'opacity 0.15s ease-in-out'
  }),
  searchClearIcon: style({
    opacity: 0.6,
    transition: 'opacity 0.2s ease-in-out, transform 0.1s ease-in-out',
    ':hover': {
      opacity: 1
    }
  })
};


export default classes;
