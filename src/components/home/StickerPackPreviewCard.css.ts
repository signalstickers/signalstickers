import { style, globalStyle } from '@vanilla-extract/css';


const classes = {
  stickerPackPreviewCard: style({
    transition: 'border 0.15s ease-in-out',
    '@media': {
      '(pointer: fine)': {
        ':hover': {
          borderColor: 'rgba(var(--bs-secondary-rgb), 0.7)'
        }
      }
    }
  }),
  cardHeader: style({
    // Creates the fade effect used for long pack titles. Light/dark mode colors
    // are applied using `globalStyle` below.
    ':after': {
      content: ' ',
      position: 'absolute',
      bottom: 0,
      pointerEvents: 'none',
      right: 0,
      top: 0,
      width: '10%'
    }
  }),
  annotation: style({
    filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.15))'
  })
};

// Pack title overflow fade for light mode.
globalStyle(`[data-bs-theme="light"] ${classes.cardHeader}:after`, {
  background: 'linear-gradient(90deg, transparent, #F8F8F8 80%)'
});

// Pack title overflow fade for dark mode.
globalStyle(`[data-bs-theme="dark"] ${classes.cardHeader}:after`, {
  background: 'linear-gradient(90deg, transparent, #282B30 80%)'
});


export default classes;
