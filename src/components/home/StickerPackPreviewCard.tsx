/* eslint-disable max-len */
import cx from 'classnames';
import React from 'react';
import { AiOutlineVideoCamera } from 'react-icons/ai';
import { BsStar } from 'react-icons/bs';
// import { IoMdHeartEmpty } from 'react-icons/io';
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


  const annotations = React.useMemo(() => (
    <aside className="position-absolute py-1 px-2 top-0 start-0 z-1 d-flex gap-1">
      {/* {meta.editorschoice && (
        <IoMdHeartEmpty
          title="Editor's Choice"
          className={cx(classes.annotation, 'text-danger')}
          style={{ transform: 'scale(0.9)' }}
        />
      )} */}
      {meta.original && (
        <BsStar
          title="Original"
          className={cx(classes.annotation, 'text-warning')}
          style={{ transform: 'scale(0.76) translateY(-1px)' }}
        />
      )}
      {meta.animated && (
        <AiOutlineVideoCamera
          title="Animated"
          className={cx(classes.annotation, 'text-secondary')}
          style={{ transform: 'scale(0.95)' }}
        />
      )}
    </aside>
  ), [
    meta.original,
    meta.animated
  ]);


  return (
    <div
      className={cx(
        classes.stickerPackPreviewCard,
        'card position-relative text-center overflow-hidden h-100 bg-transparent shadow-sm'
      )}
      aria-label={manifest.title}
    >
      {annotations}
      {cover ?
        <img
          className="card-img-top mx-auto my-auto object-fit-contain h-50 w-50"
          style={{ filter: meta.nsfw ? 'blur(4px)' : 'none' }}
          src={cover}
          alt="Cover"
        /> :
        <div
          className="card-img-top mx-auto my-auto object-fit-contain h-50 w-50"
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
