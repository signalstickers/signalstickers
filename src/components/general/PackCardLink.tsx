import { Link } from 'react-router-dom';

import StickerPackPreviewCard from 'components/home/StickerPackPreviewCard';
import { StickerPackPartial } from 'etc/types';

import classes from './PackCardLink.css';


export interface Props {
  stickerPack: StickerPackPartial;
}


/**
 * A sticker pack preview card wrapped in a link to the pack's page.
 */
export default function PackCardLink(props: Props) {
  return (
    <Link
      to={`/pack/${props.stickerPack.meta.id}`}
      className={classes.stickerPackLink}
    >
      <StickerPackPreviewCard stickerPack={props.stickerPack} />
    </Link>
  );
}
