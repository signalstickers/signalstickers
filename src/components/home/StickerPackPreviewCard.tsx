import React, {useEffect, useState} from 'react';
import {styled} from 'linaria/react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import {StickerPack} from 'etc/types';
import {getStickerInPack} from 'lib/stickers';


// ----- Props -----------------------------------------------------------------

export interface Props {
  stickerPack: StickerPack;
}


// ----- Styles ----------------------------------------------------------------

const StickerPackPreviewCard = styled.div<React.ComponentProps<'div'> & {nsfw?: boolean}>`
  text-align: center;
  transition: box-shadow 0.15s ease-in-out;

  & .card-img-top {
    height: 72px;
    width: 72px;
    margin-top: 24px;
    margin-bottom: 24px;
    margin-left: auto;
    margin-right: auto;
    transition: transform 0.15s ease-in-out;
    filter: ${props => props.nsfw ? 'blur(4px)' : 'none'};
  }

  & .card-header {
    border-bottom: none;
    border-top: 1px solid rgba(0, 0, 0, 0.125);
    font-size: 14px;
    font-weight: 600;
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
      width: 25%;
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
  useEffect(() => {
    const getCoverEffect = async () => {
      try {
        if (meta.id !== undefined) { // tslint:disable-line strict-type-predicates
          const coverImage = await getStickerInPack(meta.id, meta.key, 'cover');
          setCover(coverImage);
        }
      } catch (err) {
        console.error(`[StickerPackPreviewCard::Effect::GetCover] ${err.message}`);
      }
    };

    getCoverEffect(); // tslint:disable-line no-floating-promises
  }, []);


  // ----- Render --------------------------------------------------------------

  const title = [manifest.title, meta.nsfw && ' (NSFW)'].filter(Boolean).join('');

  return (
    <StickerPackPreviewCard className="card" nsfw={meta.nsfw} data-pack-id={meta.id} title={title}>
      {cover ? <img className="card-img-top" src={cover} /> : <div className="card-img-top"></div>}
      <div className="card-header">{title}</div>
    </StickerPackPreviewCard>
  );
};


export default StickerPackPreviewCardComponent;
