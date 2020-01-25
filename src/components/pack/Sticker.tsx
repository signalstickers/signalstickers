import React, {useState} from 'react';
import {styled} from 'linaria/react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';
import useAsyncEffect from 'use-async-effect';

import {getConvertedStickerInPack, getEmojiForSticker} from 'lib/stickers';
import {bp} from 'lib/utils';


// ----- Props -----------------------------------------------------------------

export interface Props {
  packId: string;
  packKey: string;
  stickerId: number;
}


// ----- Styles ----------------------------------------------------------------

const Sticker = styled.div`
  border: 1px solid rgba(0, 0, 0, .125);
  border-radius: 4px;
  position: relative;

  & .emoji {
    position: absolute;
    top: 2px;
    left: 6px;
    opacity: 0.75;
  }

  & img {
    width: 72px;
    height: 72px;
    object-fit: contain;
  }

  @media ${bp('sm')} {
    & img {
      width: 128px;
      height: 128px;
    }
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
  useAsyncEffect(async () => {
    const [
      emojiResult,
      stickerResult
    ] = await Promise.all([
      getEmojiForSticker(packId, packKey, stickerId),
      getConvertedStickerInPack(packId, packKey, stickerId)
    ]);

    setEmoji(emojiResult);
    setStickerSrc(stickerResult);
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
