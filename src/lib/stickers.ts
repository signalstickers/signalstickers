// ===== Stickers Module =======================================================

/**
 * This module contains several functions for loading, fetching, decrypting, and
 * caching stickers. Most notably, we fall back to a WebP-toPNG conversion when
 * on browsers that do not natively support WebP. It should be noted that this
 * process is time/CPU intensive and can cause have a significant performance
 * impact on the user's experience. Through queueing and max concurrency
 * settings, Safari seems to be able to handle this load without issue (albeit
 * far more slowly than Chrome).
 */
import axios from 'axios';
import FuzzySearch from 'fuzzy-search';
import LocalForage from 'localforage';
import * as R from 'ramda';

import {StickerPack, StickerPackPartial} from 'etc/types';
import {convertImage} from 'lib/convert-image';
import ErrorWithCode from 'lib/error';

import {
  getStickerPackManifest,
  getStickerInPack,
  getEmojiForSticker
} from '@signalstickers/stickers-client';


// ----- Locals ----------------------------------------------------------------

/**
 * Promise that will resolve with the list of sticker packs enumerated in
 * stickers.yaml. This collection will contain only those data from a
 * StickerPack that we want to search on or that we need to display a sticker
 * pack preview card. We use a promise here rather than the array itself to
 * ensure that if multiple calls to getStickerPackDirectory are made before the
 * initial request for stickerData.json resolves, we only make a single request
 * and only populate the directory once.
 */
let stickerPackDirectoryPromise: Promise<Array<StickerPackPartial>>;


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
    stickerPackDirectoryPromise = new Promise(async (resolve, reject) => {
      const res = await axios.request<Array<StickerPackPartial>>({
        method: 'GET',
        url: 'stickerData.json'
      });

      resolve(res.data);
    });
  }

  return stickerPackDirectoryPromise;
}


/**
 * Provided a sticker pack ID and optional key, queries the Signal API and
 * resolves with 'full' StickerPack object.
 */
export async function getStickerPack(id: string, key?: string): Promise<StickerPack> {
  try {
    if (!stickerPackCache.has(id)) {
      const directory = await getStickerPackDirectory();

      // Build the metadata object using information from a StickerPackPartial
      // in the directory or, if the requested sticker pack is unlisted, just
      // the id and key.
      const partial = R.find(R.pathEq(['meta', 'id'], id), directory);
      const meta = partial ? partial.meta : {id, key};

      const finalKey = key ?? meta.key;

      if (!finalKey) {
        throw new ErrorWithCode('NO_KEY_PROVIDED', `No key provided for unlisted pack: ${id}.`);
      }

      const manifest = await getStickerPackManifest(id, finalKey);

      const stickerPack: StickerPack = {
        meta,
        manifest
      };

      stickerPackCache.set(id, stickerPack);
    }

    return stickerPackCache.get(id) as StickerPack;
  } catch (err) {
    if (err.isAxiosError && err.response.status === 403) {
      throw new ErrorWithCode('MANIFEST_DECRYPT', `[getStickerPack] ${err.stack}`);
    }

    throw new ErrorWithCode(err.code, `[getStickerPack] ${err.stack}`);
  }
}


/**
 * [private]
 *
 * Returns true if the provided error was thrown because the browser is blocking
 * use of local storage and/or other storage backends.
 */
function isStorageUnavailableError(err: any) {
  const patterns = [
    // Firefox in private mode.
    /the quota has been exceeded/ig
  ];

  if (err && err.message) {
    return Boolean(R.find(curPattern => R.test(curPattern, err.message), patterns));
  }

  return false;
}


/**
 * Provided a sticker pack ID and a sticker ID (or 'cover' for the pack's cover
 * sticker) queries the Signal API and resolves with a base-64 encoded string
 * representing the image data for the indicated sticker.
 */
export async function getConvertedStickerInPack(id: string, key: string, stickerId: number): Promise<string> {
  let convertedImage = '';

  try {
    const cacheKey = `${id}-${stickerId}`;

    const imageFromCache = await stickerImageCache.getItem<string | undefined>(cacheKey);

    if (!imageFromCache) {
      const rawImageData = await getStickerInPack(id, key, stickerId);
      convertedImage = await convertImage(rawImageData);

      // This line may throw when in private mode in certain browsers.
      await stickerImageCache.setItem(cacheKey, convertedImage);

      return convertedImage;
    }

    return await stickerImageCache.getItem<string>(cacheKey);
  } catch (err) {
    if (!isStorageUnavailableError(err)) {
      throw new Error(`[getConvertedStickerInPack] Error getting sticker: ${err.message}`);
    }
  }

  // This should only be reachable if we got a "storage unavailable error", in
  // which case return the converted image.
  return convertedImage;
}


/**
 * Performs a fuzzy search on cached StickerPack data and returns the result
 * set.
 */
export function fuzzySearchStickerPacks(needle: string, haystack: Array<StickerPack>): Array<StickerPack> {
  const searchKeys = ['manifest.title', 'manifest.author', 'meta.tags'];
  const searcher = new FuzzySearch(haystack, searchKeys, {caseSensitive: false});
  return searcher.search(needle);
}


export {
  getEmojiForSticker
};
