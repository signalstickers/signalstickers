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

import sleep from '@darkobits/sleep';
import axios from 'axios';
import FuzzySearch from 'fuzzy-search';
import pQueue from 'p-queue';
import protobuf from 'protobufjs';
import * as R from 'ramda';
import {WebpMachine} from 'webp-hero';

import {STICKERS_MANIFEST_URL} from 'etc/constants';
import {
  StickerPackJson,
  StickerPackMetadata,
  StickerPackManifest,
  StickerPack,
  Sticker
} from 'etc/types';
import StickersProto from 'etc/Stickers.proto';
import {decryptManifest} from 'lib/crypto';
import ErrorWithCode from 'lib/error';


// ----- Locals ----------------------------------------------------------------

/**
 * Module-local gRPC client used to parse sticker pack manifests from the Signal
 * CDN.
 */
const protobufClient = protobuf.parse(StickersProto).root;

/**
 * Module-local in-memory copy of stickers.json, ensures we only load it once.
 */
let stickerPackListCache: Array<StickerPackMetadata> = [];

/**
 * Module-local in-memory cache used for sticker pack data from the Signal API.
 */
const stickerPackCache = new Map<string, StickerPackManifest>();

/**
 * Module-local in-memory cache used for sticker image data.
 */
const stickerImageCache = new Map<string, string>();

/**
 * Module-local asynchronous queue facility that will allow us to limit the
 * number of concurrent image conversion operations.
 */
const imageConversionQueue = new pQueue({concurrency: 2});

/**
 * Module-local WepP to PNG converter.
 */
const webpConverter = new WebpMachine();


// ----- Functions -------------------------------------------------------------

/**
 * Loads and transforms stickers.json, which is the source of truth regarding
 * all sticker packs included in the application.
 */
export async function getStickerPackList(): Promise<Array<StickerPackMetadata>> {
  if (stickerPackListCache.length === 0) {
    const res = await axios({
      method: 'GET',
      url: STICKERS_MANIFEST_URL
    });

    stickerPackListCache = R.reduce((result, [id, value]) => {
      return [
        ...result,
        {id, ...value}
      ];
    }, [], Object.entries(res.data as StickerPackJson));
  }

  return stickerPackListCache;
}


/**
 * Provided a key and an encrypted manifest from the Signal API, resolves with a
 * decrypted and parsed manifest.
 */
export async function parseManifest(key: string, rawManifest: any): Promise<StickerPackManifest> {
  try {
    const manifest = await decryptManifest(key, rawManifest);
    const PackMessage = protobufClient.lookupType('Pack');
    const manifestData = new Uint8Array(manifest, 0, manifest.byteLength);
    return PackMessage.decode(manifestData) as unknown as StickerPackManifest;
  } catch (err) {
    throw new ErrorWithCode(err.code || 'MANIFEST_PARSE', `[parseManifest] ${err.message}`);
  }
}


/**
 * Provided a sticker pack ID and key, queries the Signal API and resolves with
 * a parsed manifest.
 */
export async function getStickerPack(id: string, key: string): Promise<StickerPackManifest> {
  try {
    const cacheKey = id;

    if (!stickerPackCache.has(cacheKey)) {
      const res = await axios({
        method: 'GET',
        responseType: 'arraybuffer',
        url: `https://cdn-ca.signal.org/stickers/${id}/manifest.proto`
      });

      const manifest = await parseManifest(key, res.data);
      stickerPackCache.set(cacheKey, manifest);
    }

    return stickerPackCache.get(cacheKey) as StickerPackManifest;
  } catch (err) {
    throw new ErrorWithCode(err.code, `[getStickerPack] ${err.message}`);
  }
}


/**
 * Provided a sticker pack ID and a sticker ID (or 'cover' for the pack's cover
 * sticker) queries the Signal API and resolves with a base-64 encoded string
 * representing the image data for the indicated sticker.
 */
export async function getStickerInPack(id: string, key: string, stickerId: number | 'cover'): Promise<string> {
  try {
    const cacheKey = `${id}-${stickerId}`;

    if (!stickerImageCache.has(cacheKey)) {
      // Before we can make the request, we need to get the pack's information
      // using getStickerPack.
      const stickerPack = await getStickerPack(id, key);

      if (!stickerPack) {
        throw new Error(`[getStickerInPack] Unable to get sticker ${stickerId} in pack ${id}.`);
      }

      const finalStickerId = stickerId === 'cover' ? stickerPack.cover.id : stickerId;

      const res = await axios({
        method: 'GET',
        responseType: 'arraybuffer',
        url: `https://cdn-ca.signal.org/stickers/${id}/full/${finalStickerId}`
      });

      const manifest = await decryptManifest(key, res.data);
      const arrayBufferView = new Uint8Array(manifest, 0, manifest.byteLength);

      if (Modernizr.webp) {
        // If the browser supports WEBP, we don't need to convert it to PNG.
        const base64Data = btoa(String.fromCharCode.apply(undefined, arrayBufferView));
        stickerImageCache.set(cacheKey, `data:image/png;base64,${base64Data}`);
      } else {
        // Otherwise, convert the WEBP image to PNG before caching it. This will
        // take a noticeable amount of time/memory on the user's machine, but is
        // the only way we can display these images at this time.
        await imageConversionQueue.add(async () => {
          await sleep(50);
          stickerImageCache.set(cacheKey, await webpConverter.decode(arrayBufferView));
        });
      }
    }

    return stickerImageCache.get(cacheKey) as string;
  } catch (err) {
    throw new Error(`[getStickerInPack] Error getting sticker: ${err.stack}`);
  }
}


/**
 * Provided a sticker pack ID, key, and sticker ID, returns the emoji associated
 * with the sticker.
 */
export async function getEmojiForSticker(id: string, key: string, stickerId: number | 'cover') {
  try {
    const stickerPack = await getStickerPack(id, key);
    const finalStickerId = stickerId === 'cover' ? stickerPack.cover.id : stickerId;
    const sticker = R.find<Sticker>(R.propEq('id', finalStickerId), stickerPack.stickers);

    if (!sticker) {
      throw new Error(`Sticker pack ${id} has no sticker with ID ${stickerId}.`);
    }

    return sticker.emoji;
  } catch (err) {
    throw new Error(`[getEmojiForSticker] ${err.stack}`);
  }
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
