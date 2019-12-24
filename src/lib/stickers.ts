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

import {
  StickerPackJson,
  TransformedStickerPackJsonEntry,
  StickerPackManifest,
  StickerPack
} from 'etc/types';
import StickersProto from 'etc/Stickers.proto';
import {decryptManifest} from 'lib/crypto';


// ----- Locals ----------------------------------------------------------------

/**
 * Module-local gRPC client used to parse sticker pack manifests from the Signal
 * CDN.
 */
const protobufClient = protobuf.parse(StickersProto).root;

/**
 * Module-local in-memory cache used for sticker pack data.
 */
const stickerPackCache = new Map<string, StickerPack>();

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
 * Module-local WEBP-to-PNG converter.
 */
const webpConverter = new WebpMachine();


// ----- Functions -------------------------------------------------------------

/**
 * Loads and transforms stickers.json, which is the source of truth regarding
 * all sticker packs included in the application.
 *
 * TODO: Consider loading this from a backend/public path.
 */
export async function getStickerPackList(): Promise<Array<TransformedStickerPackJsonEntry>> {
  const res = await axios({
    method: 'GET',
    url: '/static/stickers.json'
  });

  return Object.entries(res.data as StickerPackJson).map(([id, value]) => ({
    id,
    ...value as any
  }));
}


/**
 * Provided an encrypted manifest from the Signal API, resolves with a decrypted
 * and parsed manifest object.
 */
export async function parseManifest(key: string, rawManifest: any): Promise<StickerPackManifest> {
  try {
    const manifest = await decryptManifest(key, rawManifest);
    const PackMessage = protobufClient.lookupType('Pack');
    const manifestData = new Uint8Array(manifest, 0, manifest.byteLength);
    return PackMessage.decode(manifestData) as unknown as StickerPackManifest;
  } catch (err) {
    throw new Error(`[parseManifest] Error parsing manifest: ${err.stack}`);
  }
}


/**
 * Provided a sticker pack ID, queries the Signal API and resolves with a
 * "complete" sticker pack object.
 */
export async function getStickerPack(id: string): Promise<StickerPack> {
  try {
    const cacheKey = id;

    if (!stickerPackCache.has(cacheKey)) {
      // Before we can make the request, we need to get the pack's key and other
      // metadata from our JSON manifest. We will need the key to decrypt its
      // manifest.
      const packMetadata = R.find<TransformedStickerPackJsonEntry>(R.propEq('id', id), await getStickerPackList());

      if (!packMetadata) {
        throw new Error(`[getStickerPack] Unable to load key for pack ${id}.`);
      }

      const res = await axios({
        method: 'GET',
        responseType: 'arraybuffer',
        url: `https://cdn-ca.signal.org/stickers/${id}/manifest.proto`
      });

      const manifest = await parseManifest(packMetadata.key, res.data);

      stickerPackCache.set(cacheKey, {
        id,
        key: packMetadata.key,
        tags: packMetadata.tags,
        source: packMetadata.source,
        nsfw: packMetadata.nsfw,
        // N.B. The parsed manifest contains all additional keys we need.
        ...manifest
      });
    }

    return stickerPackCache.get(cacheKey) as StickerPack;
  } catch (err) {
    throw new Error(`[getStickerPack] Error getting sticker pack ${id}: ${err.stack}`);
  }
}


/**
 * Provided a sticker pack ID and a sticker ID (or 'cover' for the pack's cover
 * sticker) queries the Signal API and resolves with a base-64 encoded string
 * representing the image data for the indicated sticker.
 */
export async function getStickerInPack(id: string, stickerId: number | 'cover'): Promise<string> {
  try {
    const cacheKey = `${id}-${stickerId}`;

    if (!stickerImageCache.has(cacheKey)) {
      // Before we can make the request, we need to get the pack's information
      // using getStickerPack.
      const stickerPack = await getStickerPack(id);

      if (!stickerPack) {
        throw new Error(`[getStickerInPack] Unable to get sticker ${stickerId} in pack ${id}.`);
      }

      const finalStickerId = stickerId === 'cover' ? stickerPack.cover.id : stickerId;

      const res = await axios({
        method: 'GET',
        responseType: 'arraybuffer',
        url: `https://cdn-ca.signal.org/stickers/${id}/full/${finalStickerId}`
      });

      const manifest = await decryptManifest(stickerPack.key, res.data);
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
 * Performs a fuzzy search on cached StickerPack data and returns the result
 * set.
 */
export function fuzzySearchStickerPacks(needle: string): Array<StickerPack> {
  const stickerPacks = Array.from(stickerPackCache.values());
  const searchKeys = ['title', 'author', 'tags'];

  const searcher = new FuzzySearch(stickerPacks, searchKeys, {
    caseSensitive: false
  });

  return searcher.search(needle);
}
