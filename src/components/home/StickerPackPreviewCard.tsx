/* eslint-disable max-len */
import cx from 'classnames';
import React from 'react';
import useAsyncEffect from 'use-async-effect';

import StickersContext from 'contexts/StickersContext';
import { SPARKLE_GOLD } from 'etc/colors';
import { StickerPackPartial } from 'etc/types';
import { generateSparkles } from 'lib/sparkles';
import { getConvertedStickerInPack } from 'lib/stickers';

import classes from './StickerPackPreviewCard.css';


export interface Props {
  stickerPack: StickerPackPartial;
}


export default function StickerPackPreviewCard(props: Props) {
  const { hasEditorsChoiceFilter } = React.useContext(StickersContext);
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


  const sparkles = React.useMemo(() => {
    if (!meta.editorschoice || hasEditorsChoiceFilter) {
      return [];
    }
    return generateSparkles(meta.id, 11);
  }, [meta.editorschoice, meta.id, hasEditorsChoiceFilter]);


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
      <div className={cx(classes.cardHeader, 'card-header', {
        [classes.sparkleCardHeader]: meta.editorschoice
      })}>
        {sparkles.map((s, i) => (
          <span
            key={i}
            className={classes.sparkle}
            aria-hidden="true"
            style={{
              top: s.top,
              left: s.left,
              fontSize: s.fontSize,
              color: `rgba(${SPARKLE_GOLD}, ${s.opacity})`,
              animationDuration: s.duration,
              animationDelay: s.delay
            }}
          >
            ✦
          </span>
        ))}
        {title}
      </div>
    </div>
  );
}
