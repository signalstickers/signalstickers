import React, {useState, useEffect} from 'react';
import {styled} from 'linaria/react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import {getStickerInPack, getEmojiForSticker} from 'lib/stickers';


// ----- Props -----------------------------------------------------------------

export interface Props {
  packId: string;
  packKey: string;
  stickerId: number | 'cover';
}


// ----- Styles ----------------------------------------------------------------

const Sticker = styled.div`
  border: 1px solid rgba(0, 0, 0, .125);
  border-radius: 8px;
  position: relative;

  & .emoji {
    position: absolute;
    top: 2px;
    left: 6px;
    opacity: 0.75;
  }

  & img {
    width: 128px;
    height: 128px;
  }
`;


// ----- Component -------------------------------------------------------------

const StickerComponent: React.FunctionComponent<Props> = ({packId, packKey, stickerId}) => {
  const [emoji, setEmoji] = useState('');
  const [stickerSrc, setStickerSrc] = useState('');


  /**
   * [Effect] Load sticker data and emoji for the sticker indicated in our
   * props.
   */
  useEffect(() => {
    async function fetchStickerDataEffect() {
      getEmojiForSticker(packId, packKey, stickerId).then(setEmoji); // tslint:disable-line no-floating-promises
      getStickerInPack(packId, packKey, stickerId).then(setStickerSrc); // tslint:disable-line no-floating-promises
    }

    fetchStickerDataEffect(); // tslint:disable-line no-floating-promises
  }, []);


  // ----- Render --------------------------------------------------------------

  if (!emoji || !stickerSrc) {
    return null; // tslint:disable-line no-null-keyword
  }

  return (
    <Sticker className="shadow-sm m-3 p-4">
      <div className="emoji">{emoji}</div>
      <img src={stickerSrc} alt="Sticker" />
    </Sticker>
  );
};


export default StickerComponent;
