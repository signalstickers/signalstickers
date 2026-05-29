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


/**
 * Deterministic hash from string to number in [0, 1).
 * Seeded with packId so each card gets a unique, stable sparkle layout.
 */
function hash(str: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return ((h % 10000) / 10000 + 10000) % 1;
}


/**
 * Generate a set of sparkle configs, unique per pack ID.
 *
 * Each sparkle gets a negative delay that is evenly distributed across its
 * cycle duration so they fire one at a time rather than in groups.
 *
 * @param count  number of sparkles (density)
 */
function generateSparkles(packId: string, count: number = 16) {
  /** Spread delays evenly: sparkle i fires at phase i/count of the cycle. */
  const phase = (i: number) => i / count;

  return Array.from({ length: count }, (_, i) => {
    const h1 = hash(packId, i * 7919);
    const h2 = hash(packId, i * 10472 + 1);
    const h3 = hash(packId, i * 13003 + 2);
    const h4 = hash(packId, i * 16007 + 3);

    const duration = 3 + hash(packId, i * 19531 + 4) * 2; // 3–5s

    return {
      top: `${h1 * 100}%`,
      left: `${h2 * 100}%`,
      fontSize: `${8 + h3 * 12}px`,
      opacity: 0.5 + h4 * 0.45,
      duration: `${duration}s`,
      /**
       * Negative delay offset by a regular phase so sparkles are evenly
       * staggered. A small jitter (±10% of one slot) keeps it organic.
       */
      delay: `-${(phase(i) + hash(packId, i * 23003 + 5) * 0.2) * duration}s`
    };
  });
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


  const sparkles = React.useMemo(() => {
    if (!meta.editorschoice) {
      return [];
    }
    return generateSparkles(meta.id, 11);
  }, [meta.editorschoice, meta.id]);


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
              color: `rgba(218, 165, 32, ${s.opacity})`,
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
