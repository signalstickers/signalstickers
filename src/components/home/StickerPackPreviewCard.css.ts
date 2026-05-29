import { keyframes, style, globalStyle } from '@vanilla-extract/css';
import { rgba } from 'polished';

import { GRAY_DARKER, GRAY_DARKER_2 } from 'etc/colors';


/** A single sparkle: fades in, flashes bright, then fades out — visible ~40% of the cycle. */
const sparkleFlash = keyframes({
  '0%, 100%': {
    opacity: 0,
    transform: 'scale(0) rotate(0deg)'
  },
  '5%': {
    transform: 'scale(1) rotate(45deg)'
  },
  '15%': {
    opacity: 1,
    transform: 'scale(1.1) rotate(90deg)'
  },
  '25%': {
    opacity: 0.7,
    transform: 'scale(0.9) rotate(135deg)'
  },
  '40%': {
    opacity: 0,
    transform: 'scale(0) rotate(180deg)'
  }
});

const classes = {
  stickerPackPreviewCard: style({
    backgroundColor: 'transparent',
    textAlign: 'center',
    transition: 'box-shadow 0.15s ease-in-out',
    overflow: 'hidden',
    position: 'relative',
    ':hover': {
      boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)'
    }
  }),
  cardImageTop: style({
    height: '72px',
    marginBottom: '24px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '24px',
    objectFit: 'contain',
    transition: 'transform 0.15s ease-in',
    width: '72px'
  }),
  cardHeader: style({
    borderBottom: 'none',
    borderTop: '1px solid rgba(0, 0, 0, 0.125)',
    fontSize: '14px',
    overflow: 'hidden',
    position: 'relative',
    whiteSpace: 'nowrap',
    ':after': {
      content: ' ',
      display: 'block',
      borderBottomRightRadius: '4px',
      bottom: 0,
      position: 'absolute',
      pointerEvents: 'none',
      right: 0,
      top: 0,
      width: '15%'
    }
  }),
  originalAnnotation: style({
    position: 'absolute',
    padding: '3px 6px',
    borderBottomRightRadius: '4px',
    fontSize: '12px',
    top: 0,
    left: 0,
    backgroundColor: 'var(--primary)',
    color: 'var(--white) !important'
  }),
  animatedAnnotation: style({
    position: 'absolute',
    padding: '3px 6px',
    fontSize: '12px',
    borderBottomLeftRadius: '4px',
    top: 0,
    right: 0,
    backgroundColor: 'var(--orange)',
    color: 'var(--white) !important'
  }),
  sparkleCardHeader: style({
    overflow: 'hidden'
  }),
  sparkle: style({
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 1,
    userSelect: 'none',
    lineHeight: 1,
    animationName: sparkleFlash,
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite'
  })
};

globalStyle(`${classes.stickerPackPreviewCard}:hover *`, {
  color: 'black'
});

globalStyle(`${classes.stickerPackPreviewCard}:hover ${classes.cardImageTop}`, {
  transform: 'scale(1.1)'
});

globalStyle([
  `.theme-light ${classes.stickerPackPreviewCard}::before`,
  `.theme-light ${classes.stickerPackPreviewCard}::after`
].join(', '), {
  boxShadow: '0px 0px 5px 3px rgba(0, 0, 0, 0.2)'
});

globalStyle(`.theme-light ${classes.stickerPackPreviewCard} .card-header`, {
  color: 'var(--dark)'
});

globalStyle(`.theme-light ${classes.stickerPackPreviewCard} .card-header::after`, {
  // This color is a one-off (even in Bootstrap) used for card headers.
  background: 'linear-gradient(90deg, rgba(247, 247, 247, 0) 0%, rgba(247, 247, 247, 1) 50%)'
});

globalStyle(`.theme-dark ${classes.stickerPackPreviewCard}`, {
  backgroundColor: 'var(--gray-dark)',
  borderColor: GRAY_DARKER,
  color: 'var(--light)',
  boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.15)'
});

globalStyle(`.theme-dark ${classes.stickerPackPreviewCard}:hover`, {
  boxShadow: '1px 1px 8px rgba(0, 0, 0, 0.25)'
});

globalStyle(`.theme-dark ${classes.stickerPackPreviewCard} .card-header`, {
  backgroundColor: GRAY_DARKER_2,
  borderColor: GRAY_DARKER,
  color: 'var(--light)'
});

globalStyle(`.theme-dark ${classes.stickerPackPreviewCard} .card-header::after`, {
  background: `linear-gradient(90deg, ${rgba(GRAY_DARKER_2, 0)} 0%, ${rgba(GRAY_DARKER_2, 1)} 50%)`
});

// ----- Sparkle (Editor's choice) ------------------------------------------------

globalStyle(`@media (prefers-reduced-motion: reduce) ${classes.sparkle}`, {
  animation: 'none'
});


export default classes;
