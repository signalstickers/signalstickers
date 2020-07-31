import React, {useState} from 'react';
import {styled} from 'linaria/react';
import useAsyncEffect from 'use-async-effect';

import {StickerPackPartial} from 'etc/types';
import {getConvertedStickerInPack} from 'lib/stickers';


// ----- Props -----------------------------------------------------------------

export interface Props {
  stickerPack: StickerPackPartial;
}


// ----- Styles ----------------------------------------------------------------

const StickerPackPreviewCard = styled.div<React.ComponentProps<'div'> & {nsfw?: boolean} & {original?: boolean}>`
  text-align: center;
  transition: box-shadow 0.15s ease-in-out;
  overflow: hidden;

  &::after{
    content: 'Original';
    top: 13px;
    left: O;
    display: ${props => (props.original ? 'block' : 'none')};
    background-color: var(--primary);
    position: absolute;
    padding: 3px 6px;
    box-shadow: 0px 0px 5px 3px rgba(0,0,0,0.2);
    color: white;
    font-size: 12px;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }

  & .card-img-top {
    height: 72px;
    width: 72px;
    object-fit: contain;
    margin-top: 24px;
    margin-bottom: 24px;
    margin-left: auto;
    margin-right: auto;
    transition: transform 0.15s ease-in;
    filter: ${props => (props.nsfw ? 'blur(4px)' : 'none')};
  }

  & .card-header {
    border-bottom: none;
    border-top: 1px solid rgba(0, 0, 0, 0.125);
    color: black;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    position: relative;

    &::after {
      background: linear-gradient(90deg, rgba(247, 247, 247, 0) 0%, rgba(247, 247, 247, 1) 50%);
      border-bottom-right-radius: 4px;
      bottom: 0;
      content: ' ';
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
`;


// ----- Component -------------------------------------------------------------

const StickerPackPreviewCardComponent: React.FunctionComponent<Props> = props => {
  const [cover, setCover] = useState<string | undefined>();
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
      nsfw={meta.nsfw}
      aria-label={title}
    >
      {cover
        ? <img className="card-img-top" src={cover} alt="Cover" />
        : <div className="card-img-top">{' '}</div>
      }
      <div className="card-header">{title}</div>
    </StickerPackPreviewCard>
  );
};


export default StickerPackPreviewCardComponent;
