import React, {useEffect, useState} from 'react';
import {styled} from 'linaria/react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';
import {darken} from 'polished';

import {TransformedStickerPackJsonEntry, StickerPack} from 'etc/types';
import {GRAY} from 'etc/colors';
import {getStickerPack, getStickerInPack} from 'lib/stickers';


// ----- Styles ----------------------------------------------------------------

const StickerPackPreviewCard = styled.div`
  align-items: flex-start;
  border-radius: 4px;
  border: 1px solid ${darken(0.15, GRAY)};
  color: black;
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: 14px;
  position: relative;
  transition: background-color 0.15s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: #FAFAFA;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);

    & .title::after {
      background: linear-gradient(90deg, rgba(250, 250, 250, 0) 0%, rgba(250, 250, 250, 1) 50%);
    }
  }

  & .thumbnail {
    height: 96px;
    margin-right: 28px;
    width: 96px;
  }

  & .properties {
    display: inline-flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: flex-start;
  }

  & .title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    position: relative;

    &::after {
      background-color: red;
      bottom: 0;
      content: ' ';
      display: block;
      pointer-events: none;
      position: absolute;
      right: 0;
      top: 0;
      width: 10%;
      background-color: red;
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%);
    }
  }

  & ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  & li {
    margin: 0;
  }

  & strong {
    font-weight: 400;
  }
`;


// ----- Props -----------------------------------------------------------------

export interface Props {
  stickerPack: TransformedStickerPackJsonEntry;
}


// ----- Component -------------------------------------------------------------

const StickerPackPreviewCardComponent: React.FunctionComponent<Props> = props => {
  const [cover, setCover] = useState<string | undefined>();
  const [stickerPack, setStickerPack] = useState<StickerPack | undefined>();
  const {id} = props.stickerPack;


  /**
   * [Effect] Loads sticker pack info when the component mounts.
   */
  useEffect(() => {
    async function getStickerPackInfoEffect() {
      if (props.stickerPack) {
        setStickerPack(await getStickerPack(id));
      }
    }

    getStickerPackInfoEffect(); // tslint:disable-line no-floating-promises
  }, []);


  /**
   * [Effect] Loads a sticker pack's cover image when the component mounts.
   */
  useEffect(() => {
    async function getStickerPackCoverEffect() {
      if (!stickerPack) {
        return;
      }

      setCover(await getStickerInPack(id, 'cover'));
    }

    getStickerPackCoverEffect(); // tslint:disable-line no-floating-promises
  }, [stickerPack]);


  // ----- Render --------------------------------------------------------------

  if (!stickerPack || !cover) {
    return null; // tslint:disable-line no-null-keyword
  }

  // N.B. Signal allows strings containing only whitespace as authors. In these
  // cases, use 'Anonymous' instead.
  const stickerPackAuthor = stickerPack.author.trim() ? stickerPack.author : 'Anonymous';

  return (
    <StickerPackPreviewCard data-pack-id={stickerPack.id} title={stickerPack.title}>
      <img className="thumbnail" src={cover} />
      <div className="properties">
        <div className="title">{stickerPack.title}</div>
        <ul>
          <li><Octicon name="person" /> {stickerPackAuthor}</li>
          <li><Octicon name="file-directory" /> {stickerPack.stickers.length}</li>
        </ul>
      </div>
    </StickerPackPreviewCard>
  );
};


export default StickerPackPreviewCardComponent;
