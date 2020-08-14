import {styled} from 'linaria/react';
import React, {useState} from 'react';
import useAsyncEffect from 'use-async-effect';

import {GRAY_DARKER} from 'etc/colors';
import {getConvertedStickerInPack, getEmojiForSticker} from 'lib/stickers';


// ----- Props -----------------------------------------------------------------

export interface Props {
  packId: string;
  packKey: string;
  stickerId: number;
}


// ----- Styles ----------------------------------------------------------------

const Sticker = styled.div`
  align-items: center;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, .125);
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 16px;
  position: relative;
  width: 100%;

  & .emoji {
    position: absolute;
    top: 2px;
    left: 5px;
    opacity: 0.75;
  }

  & img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /**
   * This ensures that the component has a 1:1 aspect ratio, even if there is
   * no content or the content's aspect ratio is not 1:1. This way, the page's
   * structure can be laid-out while stickers are loaded.
   */
  &::before {
    content: '';
    display: inline-block;
    width: 1px;
    height: 0px;
    padding-bottom: calc(100%);
  }

  .theme-light & {
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.08);
  }

  .theme-dark & {
    border-color: ${GRAY_DARKER};
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.15);
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
  }, [
    packId,
    packKey,
    stickerId
  ]);


  // ----- Render --------------------------------------------------------------

  return (
    <Sticker>
      {emoji && stickerSrc ?
        <>
          <div className="emoji">{emoji}</div>
          <img src={stickerSrc} alt="Sticker" />
        </> :
        <div className="spinner-border text-light" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      }
    </Sticker>
  );
};


export default StickerComponent;
