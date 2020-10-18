import {styled} from 'linaria/react';
import {rgba} from 'polished';
import React from 'react';
import useAsyncEffect from 'use-async-effect';

import {GRAY_DARKER_2, GRAY_DARKER} from 'etc/colors';
import {StickerPackPartial} from 'etc/types';
import {getConvertedStickerInPack} from 'lib/stickers';


// ----- Props -----------------------------------------------------------------

export interface Props {
  stickerPack: StickerPackPartial;
}

interface StickerPackPreviewCardProps extends React.ComponentProps<'div'> {
  nsfw?: boolean;
  original?: boolean;
  animated?: boolean;
}


// ----- Styles ----------------------------------------------------------------

const StickerPackPreviewCard = styled.div<StickerPackPreviewCardProps>`
  background-color: transparent;
  text-align: center;
  transition: box-shadow 0.15s ease-in-out;
  overflow: hidden;

  &::before, &::after {
    color: white;
    font-size: 12px;
    padding: 3px 6px 3px 3px;
    position: absolute;
    top: 13px;
  }

  &::before {
    content: 'Original';
    background-color: var(--primary);
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    color: var(--white);
    display: ${props => props.original ? 'block' : 'none'};
    font-size: 12px;
    left: 0;
    left: O;
    padding: 3px 6px;
    position: absolute;
    top: 13px;
  }

  &::after {
    content: 'Animated';
    background-color: var(--orange);
    border-bottom-left-radius: 4px;
    border-top-left-radius: 4px;
    display: ${props => props.animated ? 'block' : 'none'};
    padding: 3px 6px;
    right: 0;
  }

  & .card-img-top {
    filter: ${props => props.nsfw ? 'blur(4px)' : 'none'};
    height: 72px;
    margin-bottom: 24px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 24px;
    object-fit: contain;
    transition: transform 0.15s ease-in;
    width: 72px;
  }

  & .card-header {
    border-bottom: none;
    border-top: 1px solid rgba(0, 0, 0, 0.125);
    font-size: 14px;
    overflow: hidden;
    position: relative;
    white-space: nowrap;

    &::after {
      content: ' ';
      border-bottom-right-radius: 4px;
      bottom: 0;
      display: block;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
      width: 15%;
    }
  }

  &:hover {
    * {
      color: black;
    }

    & .card-img-top {
      transform: scale(1.1)
    }

    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  }

  .theme-light & {
    &::before, &::after {
      box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.2);
    }

    & .card-header {
      color: var(--dark);

      &::after {
        /* This color is a one-off (even in Bootstrap) used for card headers. */
        background: linear-gradient(90deg, rgba(247, 247, 247, 0) 0%, rgba(247, 247, 247, 1) 50%);
      }
    }
  }

  .theme-dark & {
    background-color: var(--gray-dark);
    border-color: ${GRAY_DARKER};
    color: var(--light);
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.15);

    &:hover {
      box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.25);
    }

    & .card-header {
      background-color: ${GRAY_DARKER_2};
      border-color: ${GRAY_DARKER};
      color: var(--light);

      &::after {
        background: linear-gradient(90deg, ${rgba(GRAY_DARKER_2, 0)} 0%, ${rgba(GRAY_DARKER_2, 1)} 50%);
      }
    }
  }
`;


// ----- Component -------------------------------------------------------------

const StickerPackPreviewCardComponent: React.FunctionComponent<Props> = props => {
  const [cover, setCover] = React.useState<string | undefined>();
  const {meta, manifest} = props.stickerPack;


  /**
   * [Effect] Loads a sticker pack's cover image when the component mounts.
   */
  useAsyncEffect(async () => {
    try {
      if (meta.id !== undefined) {
        const coverImage = await getConvertedStickerInPack(meta.id, meta.key, manifest.cover.id);
        setCover(coverImage);
      }
    } catch (err) {
      console.error(`[StickerPackPreviewCard::Effect::GetCover] ${err.message}`);
    }
  }, [
    meta.id,
    meta.key,
    manifest.cover.id
  ]);


  // ----- Render --------------------------------------------------------------

  const title =`${manifest.title}${meta.nsfw ? ' (NSFW)' : ''}`;

  return (
    <StickerPackPreviewCard
      className="card"
      original={meta.original}
      animated={meta.animated}
      nsfw={meta.nsfw}
      aria-label={title}
    >
      {cover ?
        <img className="card-img-top" src={cover} alt="Cover" /> :
        <div className="card-img-top">{' '}</div>
      }
      <div className="card-header">
        {title}
      </div>
    </StickerPackPreviewCard>
  );
};


export default StickerPackPreviewCardComponent;
