import { style, globalStyle } from '@vanilla-extract/css';

import { GRAY_DARKER } from 'etc/colors';


const classes = {
  sticker: style({
    alignItems: 'center',
    aspectRatio: '1 / 1',
    borderRadius: '4px',
    border: '1px solid rgba(0, 0, 0, .125)',
    display: 'flex',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    width: '100%'
  }),
  stickerImage: style({
    height: '100%',
    objectFit: 'contain',
    width: '100%'
  }),
  stickerEmoji: style({
    position: 'absolute',
    top: '2px',
    left: '6px',
    opacity: 0.75
  })
};

globalStyle(`.theme-light ${classes.sticker}`, {
  boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.08)'
});

globalStyle(`.theme-dark ${classes.sticker}`, {
  borderColor: GRAY_DARKER,
  boxShadow: '1px 1px 4px rgba(0, 0, 0, 0.15)'
});


export default classes;
