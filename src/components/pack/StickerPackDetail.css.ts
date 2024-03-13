import { style, globalStyle } from '@vanilla-extract/css';

import { GRAY_DARKER } from 'etc/colors';
import { bp } from 'lib/utils';


const classes = {
  stickerPackDetail: style({
    // Empty class.
  }),
  /**
   * N.B. We use CSS Grid here rather than the Bootstrap grid because it allows
   * us to specify odd numbers of identically-sized columns, which we cannot do
   * in Bootstrap's 12-column grid.
   */
  stickerGridView: style({
    display: 'grid',
    gridGap: '24px',
    gridTemplateColumns: 'repeat(2, 1fr)',
    justifyContent: 'space-between',
    '@media': {
      [bp('sm')]: {
        gridTemplateColumns: 'repeat(3, 1fr)'
      },
      [bp('md')]: {
        gridTemplateColumns: 'repeat(4, 1fr)'
      },
      [bp('lg')]: {
        gridTemplateColumns: 'repeat(5, 1fr)'
      },
      [bp('xl')]: {
        gridTemplateColumns: 'repeat(6, 1fr)'
      }
    }
  })
};

globalStyle(`${classes.stickerPackDetail} h1`, {
  fontSize: '2rem'
});

globalStyle(`${classes.stickerPackDetail} strong`, {
  fontWeight: 600
});

globalStyle(`${classes.stickerPackDetail} svg`, {
  fontSize: '20px'
});

globalStyle([
  `${classes.stickerPackDetail} svg.arrow-left-icon`,
  `${classes.stickerPackDetail} svg.plus-icon`
].join(', '), {
  transform: 'transform: scale(1.2) translateY(2px)'
});

globalStyle(`${classes.stickerPackDetail} svg.star-icon`, {
  color: 'gold'
});

globalStyle(`${classes.stickerPackDetail} .list-group-item`, {
  alignItems: 'center',
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'row',
  fontSize: '14px'
});

globalStyle(`${classes.stickerPackDetail} .nbStickers`, {
  color: GRAY_DARKER
});

globalStyle(`.theme-dark ${classes.stickerPackDetail}`, {
  borderColor: GRAY_DARKER
});

globalStyle(`.theme-dark ${classes.stickerPackDetail} .list-group-item`, {
  borderColor: GRAY_DARKER
});


export default classes;
