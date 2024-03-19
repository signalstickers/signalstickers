/* eslint-disable max-len */
import cx from 'classnames';
import React from 'react';
import useAsyncEffect from 'use-async-effect';

import { StickerPackPartial } from 'etc/types';
import { getConvertedStickerInPack } from 'lib/stickers';

import classes from './StickerPackPreviewCard.css';


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
    <aside
      className={cx(
        classes.originalAnnotation,
        'position-absolute py-1 px-2 fs-7 top-0 start-0 bg-primary text-light shadow-sm z-1'
      )}
    >
      Original
    </aside>
  ), []);


  const animatedAnnotation = React.useMemo(() => (
    <aside
      className={cx(
        classes.animatedAnnotation,
        'position-absolute py-1 px-2 fs-7 top-0 end-0 text-light shadow-sm z-1'
      )}
    >
      Animated
    </aside>
  ), []);


  return (
    <div
      className={cx(
        classes.stickerPackPreviewCard,
        'card position-relative text-center overflow-hidden bg-transparent shadow-sm'
      )}
      aria-label={manifest.title}
    >
      {meta.original && originalAnnotation}
      {meta.animated && animatedAnnotation}
      {cover ?
        <img
          className="card-img-top mx-auto my-4 object-fit-contain"
          style={{ filter: meta.nsfw ? 'blur(4px)' : 'none' }}
          src={cover}
          alt="Cover"
        /> :
        <div
          className="card-img-top mx-auto my-4 object-fit-contain"
          style={{ filter: meta.nsfw ? 'blur(4px)' : 'none' }}
        >
          {' '}
        </div>
      }
      <div
        className={cx(
          classes.cardHeader,
          'card-header border border-top-1 border-start-0 border-end-0 border-bottom-0',
          'position-relative fs-6 text-nowrap overflow-hidden border-tertiary'
        )}
      >
        {manifest.title}
      </div>
    </div>
  );
}
