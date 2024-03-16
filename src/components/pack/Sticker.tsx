import React from 'react';
import useAsyncEffect from 'use-async-effect';

import { getConvertedStickerInPack, getEmojiForSticker } from 'lib/stickers';

import classes from './Sticker.css';


export interface StickerProps {
  packId: string;
  packKey: string;
  stickerId: number;
}


export default function Sticker({ packId, packKey, stickerId }: StickerProps) {
  const [emoji, setEmoji] = React.useState('');
  const [stickerSrc, setStickerSrc] = React.useState('');


  /**
   * [Effect] Load sticker data and emoji for the sticker indicated in our
   * props.
   */
  useAsyncEffect(async isMounted => {
    const [
      emojiResult,
      stickerResult
    ] = await Promise.all([
      getEmojiForSticker(packId, packKey, stickerId),
      getConvertedStickerInPack(packId, packKey, stickerId)
    ]);

    // The user may have navigated away from this page before all stickers have
    // loaded, causing the component to un-mount before the above Promises
    // resolve. Calling setState on an un-mounted component is a no-op, but
    // triggers a warning in development mode. Fortunately, use-async-effect
    // provides an isMounted predicate we can call to determine if we should
    // proceed with updating a component's state after potentially lengthy async
    // operations.
    if (isMounted()) {
      setEmoji(emojiResult);
      setStickerSrc(stickerResult);
    }
  }, [
    packId,
    packKey,
    stickerId
  ]);


  return (
    <div className={classes.sticker}>
      {emoji && stickerSrc ?
        <>
          <div className={classes.stickerEmoji}>
            {emoji}
          </div>
          <img
            src={stickerSrc}
            alt="Sticker"
            className="w-100 h-100"
          />
        </> :
        <div className="spinner-border text-light" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      }
    </div>
  );
}
