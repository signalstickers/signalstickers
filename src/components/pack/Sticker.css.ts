import { style, globalStyle } from '@vanilla-extract/css';

import { GRAY_DARKER } from 'etc/colors';


const classes = {
  sticker: style({
    alignItems: 'center',
    borderRadius: '4px',
    border: '1px solid rgba(0, 0, 0, .125)',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    padding: '16px',
    position: 'relative',
    width: '100%',
    /**
     * This ensures that the component has a 1:1 aspect ratio, even if there is
     * no content or the content's aspect ratio is not 1:1. This way, the page's
     * structure can be laid-out while stickers are loaded.
     */
    '::before': {
      content: '',
      display: 'inline-block',
      width: '1px',
      height: '0px',
      paddingBottom: 'calc(100%)'
    }
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
