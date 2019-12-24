import React, {useEffect, useState} from 'react';
import {styled} from 'linaria/react';
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
  padding: 14px;
  transition: background-color 0.15s ease-in-out, box-shadow 0.2s ease-in-out;

  &:hover {
    background-color: ${darken(0.02, 'white')};
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
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
    <StickerPackPreviewCard data-pack-id={stickerPack.id}>
      <img className="thumbnail" src={cover} />
      <div className="properties">
        <div className="title">{stickerPack.title}</div>
        <ul>
          <li><strong>Author:</strong> {stickerPackAuthor}</li>
          <li><strong>Stickers:</strong> {stickerPack.stickers.length}</li>
        </ul>
      </div>
    </StickerPackPreviewCard>
  );
};


export default StickerPackPreviewCardComponent;
