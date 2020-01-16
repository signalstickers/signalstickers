// ===== Signal Stickers Module ================================================

/**
 * This module contains several functions for loading, fetching, decrypting, and
 * caching sticker manifests and images from the Signal API.
 */
import axios from 'axios';
import protobuf from 'protobufjs';

import StickersProto from 'etc/stickers-proto';
import {StickerPackManifest} from 'etc/types';
import {decryptManifest} from 'lib/crypto';
import ErrorWithCode from 'lib/error';


// ----- Locals ----------------------------------------------------------------

/**
 * gRPC type definition for Signal's sticker pack manifests.
 */
const packMessage = protobuf.Root.fromJSON(StickersProto).root.lookupType('Pack');


/**
 * In-memory cache of sticker pack manifests. Helps us avoid making un-necessary
 * network requests.
 */
const stickerPackManifestCache = new Map<string, Promise<StickerPackManifest>>();


/**
 * In-memory cache of sticker image data. Helps us avoid making un-necessary
 * network requests.
 */
const stickerImageCache = new Map<string, Promise<Uint8Array>>();


// ----- Functions -------------------------------------------------------------

/**
 * Provided a key and an encrypted manifest from the Signal API, resolves with a
 * decrypted and parsed manifest.
 */
async function parseManifest(key: string, rawManifest: any): Promise<StickerPackManifest> {
  try {
    const manifest = await decryptManifest(key, rawManifest);
    const manifestData = new Uint8Array(manifest, 0, manifest.byteLength);
    return packMessage.decode(manifestData) as unknown as StickerPackManifest;
  } catch (err) {
    throw new ErrorWithCode(err.code || 'MANIFEST_PARSE', `[parseManifest] ${err.stack}`);
  }
}


/**
 * Provided a sticker pack ID and key, queries the Signal API and resolves with
 * a sticker pack manifest.
 */
export async function getStickerPackManifest(id: string, key: string): Promise<StickerPackManifest> {
  if (!stickerPackManifestCache.has(id)) {
    stickerPackManifestCache.set(id, new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'GET',
          responseType: 'arraybuffer',
          url: `https://cdn-ca.signal.org/stickers/${id}/manifest.proto`
        });

        const manifest = await parseManifest(key, res.data);

        resolve(manifest);
      } catch (err) {
        reject(err);
      }
    }));
  }

  return stickerPackManifestCache.get(id) as Promise<StickerPackManifest>;
}


/**
 * Provided a sticker pack ID and a sticker ID (or 'cover' for the pack's cover
 * sticker) queries the Signal API and resolves with the raw WebP image data for
 * the indicated sticker.
 *
 * Note: Web users who want to use this data to render an image will need to
 * prefix this string with "data:image/webp;base64,".
 */
export async function getStickerInPack(id: string, key: string, stickerId: number): Promise<Uint8Array> {
  const cacheKey = `${id}-${stickerId}`;

  if (!stickerImageCache.has(cacheKey)) {
    stickerImageCache.set(cacheKey, new Promise(async (resolve, reject) => {
      try {
        const res = await axios({
          method: 'GET',
          responseType: 'arraybuffer',
          url: `https://cdn-ca.signal.org/stickers/${id}/full/${stickerId}`
        });

        const stickerManifest = await decryptManifest(key, res.data);
        const rawWebpData = new Uint8Array(stickerManifest, 0, stickerManifest.byteLength);

        resolve(rawWebpData);
      } catch (err) {
        reject(err);
      }
    }));
  }

  return stickerImageCache.get(cacheKey) as Promise<Uint8Array>;
}


/**
 * Provided a sticker pack ID, key, and sticker ID, returns the emoji associated
 * with the sticker.
 */
export async function getEmojiForSticker(id: string, key: string, stickerId: number): Promise<string> {
  const packManifest = await getStickerPackManifest(id, key);

  const sticker = packManifest.stickers.find(curSticker => curSticker.id === stickerId);

  if (!sticker) {
    throw new Error(`Sticker pack ${id} has no sticker with ID ${stickerId}.`);
  }

  return sticker.emoji;
}
