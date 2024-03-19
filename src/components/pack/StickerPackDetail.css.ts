import { style } from '@vanilla-extract/css';

import { bp } from 'lib/utils';


export default {
  stickerPackMetadataItem: style({
    backgroundColor: 'rgba(var(--bs-body-color-rgb), 0.03)'
  }),
  /**
   * N.B. We use CSS Grid here rather than the Bootstrap grid because it allows
   * us to specify odd numbers of identically-sized columns, which we cannot do
   * in Bootstrap's 12-column grid.
   */
  stickerGridView: style({
    display: 'grid',
    gridGap: '14px',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    justifyContent: 'space-between',
    '@media': {
      [bp('sm')]: {
        gridGap: '24px',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))'
      },
      [bp('md')]: {
        gridGap: '21px',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))'
      },
      [bp('lg')]: {
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))'
      },
      [bp('xl')]: {
        gridTemplateColumns: 'repeat(6, minmax(0, 1fr))'
      }
    }
  })
};
