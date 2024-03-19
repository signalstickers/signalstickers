import { style, globalStyle } from '@vanilla-extract/css';


const classes = {
  stickerPackPreviewCard: style({
    transition: 'border 0.15s ease-in-out',
    ':hover': {
      borderColor: 'rgba(var(--bs-secondary-rgb), 0.7)'
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
  originalAnnotation: style({
    borderBottomRightRadius: '4px'
  }),
  animatedAnnotation: style({
    borderBottomLeftRadius: '4px',
    backgroundColor: 'var(--bs-orange)'
  })
};

globalStyle(`${classes.stickerPackPreviewCard} .card-img-top`, {
  width: '72px',
  height: '72px'
});

// Pack title overflow fade for light mode.
globalStyle(`[data-bs-theme="light"] ${classes.cardHeader}:after`, {
  background: 'linear-gradient(90deg, transparent, #F8F8F8 80%)'
});

// Pack title overflow fade for dark mode.
globalStyle(`[data-bs-theme="dark"] ${classes.cardHeader}:after`, {
  background: 'linear-gradient(90deg, transparent, #282B30 80%)'
});


export default classes;
