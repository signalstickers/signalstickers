// ===== Stickers Module =======================================================

/**
 * This module contains several functions for loading, fetching, decrypting, and
 * caching stickers. Most notably, we fall back to a WebP-to-PNG conversion when
 * on browsers that do not natively support WebP. It should be noted that this
 * process is time/CPU intensive and can have a significant performance impact
 * on the user's experience. Through queueing and max concurrency settings,
 * Safari seems to be able to handle this load without issue (albeit far more
 * slowly than Chrome).
 */
import {
  getStickerPackManifest,
  getStickerInPack
} from '@signalstickers/stickers-client';
import axios from 'axios';
import LocalForage from 'localforage';
import * as R from 'ramda';

import { API_URL_PACKS, PACK_ID_PATTERN } from 'etc/constants';
import {
  StickerPack,
  StickerPackPartial,
  StickerPackMetadata
} from 'etc/types';
import { convertImage } from 'lib/convert-image';
import ErrorWithCode from 'lib/error';
import { isStorageUnavailableError } from 'lib/utils';


// ----- Locals ----------------------------------------------------------------

/**
 * Promise that will resolve with the list of sticker packs enumerated in our
 * directory. This collection will contain only those data from a StickerPack
 * that we want to search on or that we need in order to display a sticker pack
 * preview card. We use a promise here rather than the array itself to ensure
 * that if multiple calls to `getStickerPackDirectory` are made before the
 * initial request resolves, we only make a single request and only populate
 * the directory once.
 */
let stickerPackDirectoryPromise: Promise<Array<StickerPackPartial>> | undefined;


/**
 * In-memory cache of StickerPack objects.
 */
const stickerPackCache = new Map<string, StickerPack>();


/**
 * Module-local browser-storage-backed cache used for sticker image data.
 */
const stickerImageCache = LocalForage.createInstance({
  name: 'Signal Stickers',
  storeName: 'Image Cache'
});


// ----- Functions -------------------------------------------------------------

/**
 * Resolves with a list of StickerPackPartial objects.
 */
export async function getStickerPackDirectory(): Promise<Array<StickerPackPartial>> {
  if (!stickerPackDirectoryPromise) {
    stickerPackDirectoryPromise = axios.request<Array<StickerPackPartial>>({
      method: 'GET',
      url: API_URL_PACKS
    }).then(R.prop('data'));
  }

  return stickerPackDirectoryPromise;
}


/**
 * Provided a sticker pack ID and optional key, queries the Signal API and
 * resolves with a 'full' StickerPack object containing data from Signal merged
 * with data from our backend.
 */
export async function getStickerPack(id: string, key?: string): Promise<StickerPack> {
  if (!new RegExp(PACK_ID_PATTERN).test(id)) {
    throw new ErrorWithCode('INVALID_PACK_ID', `Invalid pack ID: ${id}`);
  }

  const cacheKey = key ? `${id}-${key}` : id;

  try {
    if (!stickerPackCache.has(cacheKey)) {
      const directory = await getStickerPackDirectory();

      // Build the metadata object using information from a StickerPackPartial
      // in the directory or, if the requested sticker pack is unlisted, just
      // the id and key.
      const partial = R.find<StickerPackPartial>(R.pathEq(id, ['meta', 'id']), directory);

      // Use the key from the directory if possible. Otherwise, use the key
      // provided by the caller.
      const finalKey = partial?.meta.key ?? key;

      if (!finalKey) {
        throw new ErrorWithCode('NO_KEY_PROVIDED', `No key provided for unlisted pack: ${id}.`);
      }

      const meta: StickerPackMetadata = partial ? {
        ...partial.meta,
        unlisted: false
      } : {
        id,
        key: finalKey,
        unlisted: true
      };

      const manifest = await getStickerPackManifest(id, finalKey);

      const stickerPack = {
        meta,
        manifest
      } as StickerPack;

      stickerPackCache.set(cacheKey, stickerPack);
    }

    return stickerPackCache.get(cacheKey) as StickerPack;
  } catch (err: any) {
    if (err.isAxiosError && err.response.status === 403) {
      throw new ErrorWithCode('MANIFEST_DECRYPT', `[getStickerPack] ${err.stack}`);
    }

    throw new ErrorWithCode(err.code, `[getStickerPack] ${err.stack}`);
  }
}


/**
 * Provided a sticker pack ID, pack key, and sticker ID, and queries the Signal
 * API and resolves with a base-64 encoded string containing either WebP or PNG
 * data (based on client support for the former) for the indicated sticker.
 */
export async function getConvertedStickerInPack(id: string, key: string, stickerId: number): Promise<string> {
  let convertedImage = '';

  try {
    const cacheKey = `${id}-${stickerId}`;

    const imageFromCache = await stickerImageCache.getItem<string | undefined>(cacheKey);

    if (!imageFromCache) {
      const rawImageData = await getStickerInPack(id, key, stickerId);
      convertedImage = await convertImage(rawImageData);

      // This line may throw when in private mode in certain browsers, or when
      // not using an HTTPS connection, in which case access to the SubtleCrypto
      // API is disallowed. This should only ever occur on mobile devices in
      // development.
      await stickerImageCache.setItem(cacheKey, convertedImage);

      return convertedImage;
    }

    return await stickerImageCache.getItem(cacheKey) as string;
  } catch (err: any) {
    if (!isStorageUnavailableError(err)) {
      throw new Error(`[getConvertedStickerInPack] Error getting sticker: ${err.message}`);
    }
  }

  // This should only be reachable if we got a "storage unavailable error", in
  // which case return the converted image.
  return convertedImage;
}


export { getEmojiForSticker } from '@signalstickers/stickers-client';
