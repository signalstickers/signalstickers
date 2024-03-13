/* eslint-disable max-len */
import cx from 'classnames';
import React from 'react';
import useAsyncEffect from 'use-async-effect';

import { StickerPackPartial } from 'etc/types';
import { getConvertedStickerInPack } from 'lib/stickers';

import classes from './StickerPackPreviewCard.css';

// ----- Props -----------------------------------------------------------------

export interface Props {
  stickerPack: StickerPackPartial;
}


export default function StickerPackPreviewCard(props: Props) {
  const [cover, setCover] = React.useState<string | undefined>();
  const { meta, manifest } = props.stickerPack;


  /**
   * [Effect] Loads a sticker pack's cover image when the component mounts.
   */
  useAsyncEffect(async () => {
    try {
      if (manifest.cover === undefined) {
        manifest.cover = { id: 0, emoji: '' };
      }
      if (meta.id !== undefined) {
        const coverImage = await getConvertedStickerInPack(meta.id, meta.key, manifest.cover.id);
        setCover(coverImage);
      }
    } catch (err: any) {
      console.error(`[StickerPackPreviewCard::Effect::GetCover] ${err.message}`);
    }
  }, [
    meta.id,
    meta.key,
    manifest
  ]);


  const originalAnnotation = React.useMemo(() => (
    <aside className={cx(classes.originalAnnotation, 'shadow-sm')}>
      Original
    </aside>
  ), []);


  const animatedAnnotation = React.useMemo(() => (
    <aside className={cx(classes.animatedAnnotation, 'shadow-sm')}>
      Animated
    </aside>
  ), []);


  const title = `${manifest.title}${meta.nsfw ? ' (NSFW)' : ''}`;


  return (
    <div
      className={cx(classes.stickerPackPreviewCard, 'card')}
      aria-label={title}
    >
      {meta.original && originalAnnotation}
      {meta.animated && animatedAnnotation}
      {cover ?
        <img
          className={classes.cardImageTop}
          style={{
            filter: meta.nsfw ? 'blur(4px)' : 'none'
          }}
          src={cover}
          alt="Cover"
        /> :
        <div
          className={classes.cardImageTop}
          style={{
            filter: meta.nsfw ? 'blur(4px)' : 'none'
          }}
        >
          {' '}
        </div>
      }
      <div className={cx(classes.cardHeader, 'card-header')}>
        {title}
      </div>
    </div>
  );
}
