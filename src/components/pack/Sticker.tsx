import cx from 'classnames';
import React from 'react';
import useAsyncEffect from 'use-async-effect';

import { getConvertedStickerInPack, getEmojiForSticker } from 'lib/stickers';


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

    if (!isMounted()) return;

    setEmoji(emojiResult);
    setStickerSrc(stickerResult);
  }, [
    packId,
    packKey,
    stickerId
  ]);


  return (
    <div
      className={cx(
        'position-relative d-flex align-items-center justify-content-center',
        'ratio ratio-1x1 border rounded shadow-sm'
      )}
      style={{ backgroundColor: 'rgba(var(--bs-body-color-rgb), 0.03)' }}
    >
      {emoji && stickerSrc ? (
        <div>
          <aside
            className="position-absolute"
            aria-label="Sticker Emoji"
            style={{ top: 3, left: 6, opacity: 1, zIndex: 1 }}
          >{emoji}</aside>
          <img
            src={stickerSrc}
            alt="Sticker"
            className="w-100 h-100 p-4"
          />
        </div>
      ) : (
        <div className="p-5">
          <aside
            className="spinner-border text-secondary border-2 w-100 h-100"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </aside>
        </div>
      )}
    </div>
  );
}
