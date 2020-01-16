// ===== Crypto Utilities ======================================================

/**
 * This module contains various functions that aid in the decryption of sticker
 * pack data from Signal. Browser detection for browser support of the
 * SubtleCrypto API should probably be added at some point.
 *
 * TODO: This module, along with signal.ts, should be refactored-out into a
 * separate NPM package with separate browser/Node imports, which will allow us
 * to make this code a bit cleaner. For now, this let's us use a consistent API
 * for both environments.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 */
import crypto from 'crypto';
import hkdf from 'js-crypto-hkdf';
import ErrorWithCode from 'lib/error';


const IS_BROWSER = typeof window !== 'undefined'; // tslint:disable-line


/**
 * [private]
 *
 * Converts the provided string to a Uint8Array.
 */
function hexToArrayBuffer(hexString: string) {
  const result = [];
  let tmpHexString = hexString;

  while (tmpHexString.length >= 2) {
    result.push(parseInt(tmpHexString.substring(0, 2), 16));
    tmpHexString = tmpHexString.substring(2, tmpHexString.length);
  }

  return new Uint8Array(result);
}


/**
 * [private]
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey
 */
async function deriveKeys(encodedKey: string) {
  const hash = 'SHA-256';
  const length = 512;
  const salt = new ArrayBuffer(32);
  const info = 'Sticker Pack';

  if (IS_BROWSER) {
    const masterKey = await window.crypto.subtle.importKey('raw', hexToArrayBuffer(encodedKey), 'HKDF', false, ['deriveKey']);

    const algorithm: HkdfParams = {
      name: 'HKDF',
      hash,
      salt,
      info: new TextEncoder().encode(info)
    };

    const derivedKeyAlgorithm = {
      name: 'HMAC',
      hash,
      length
    };

    // @ts-ignore (The typedef for the SubtleCrypto API incorrectly states that
    // we need an HkdfCtrParams object as our first param when in fact we need a
    // HkdfParams object.)
    const derivedKeys = await window.crypto.subtle.deriveKey(algorithm, masterKey, derivedKeyAlgorithm, true, ['verify']);

    const derivedKeyBytes = await window.crypto.subtle.exportKey('raw', derivedKeys);
    return [derivedKeyBytes.slice(0, 32), derivedKeyBytes.slice(32, 64)];
  } else { // tslint:disable-line unnecessary-else
    const masterKey = Buffer.from(encodedKey, 'hex');
    const derivedKey = (await hkdf.compute(masterKey, hash, length, info, salt as Uint8Array)).key;
    return [derivedKey.slice(0, 32), derivedKey.slice(32, 64)];
  }
}


/**
 * Decrypts a manifest returned from the Signal API using a sticker pack's
 * pack key, provided from stickers.yml.
 */
export async function decryptManifest(encodedKey: string, rawManifest: any) {
  try {
    if (IS_BROWSER) {
      const keys = await deriveKeys(encodedKey);
      const encryptedManifest = new Uint8Array(rawManifest);
      const theirIv = encryptedManifest.slice(0, 16);
      const cipherTextBody = encryptedManifest.slice(16, encryptedManifest.byteLength - 32);
      const theirMac = encryptedManifest.slice(encryptedManifest.byteLength - 32, encryptedManifest.byteLength);
      const combinedCipherText = encryptedManifest.slice(0, encryptedManifest.byteLength - 32);
      const macKey = await window.crypto.subtle.importKey('raw', keys[1], {name: 'HMAC', hash: {name: 'SHA-256'}}, false, ['verify', 'sign']);
      const isValid = await window.crypto.subtle.verify('HMAC', macKey, theirMac, combinedCipherText);

      if (!isValid) {
        throw new Error('MAC verification failed.');
      }

      const cipherKey = await window.crypto.subtle.importKey('raw', keys[0], 'AES-CBC', false, ['decrypt']);
      return window.crypto.subtle.decrypt({name: 'AES-CBC', iv: theirIv}, cipherKey, cipherTextBody);
    } else { // tslint:disable-line unnecessary-else
      const [aesKey, hmacKey] = await deriveKeys(encodedKey);

      // rawManifest: IV || Ciphertext || truncated MAC(IV||Ciphertext)
      const theirIv = rawManifest.slice(0, 16);
      const cipherTextBody = rawManifest.slice(16, rawManifest.length - 32);
      const theirMac = rawManifest.slice(rawManifest.byteLength - 32, rawManifest.byteLength).toString('hex');
      const combinedCipherText = rawManifest.slice(0, rawManifest.byteLength - 32);

      // Validate signature
      const computedMac = crypto.createHmac('sha256', hmacKey as any).update(combinedCipherText).digest('hex');
      if (theirMac !== computedMac) {
        throw new Error(`MAC verification failed.`);
      }

      const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey as any, theirIv);
      return Buffer.concat([decipher.update(cipherTextBody), decipher.final()]);
    }
  } catch (err) {
    throw ErrorWithCode.from('MANIFEST_DECRYPT', err);
  }
}
