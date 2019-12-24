// ===== Crypto Utilities ======================================================

/**
 * This module contains various functions that aid in the decryption of sticker
 * pack data from Signal. Browser detection for browser support of the
 * SubtleCrypto API should probably be added at some point.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 */

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
  const masterKey = await window.crypto.subtle.importKey('raw', hexToArrayBuffer(encodedKey), 'HKDF', false, ['deriveKey']);

  const algorithm: HkdfParams = {
    name: 'HKDF',
    hash: 'SHA-256',
    salt: new ArrayBuffer(32),
    info: new TextEncoder().encode('Sticker Pack')
  };

  const derivedKeyAlgorithm = {
    name: 'HMAC',
    hash: 'SHA-256',
    length: 512
  };

  // @ts-ignore (The typedef for the SubtleCrypto API incorrectly states that
  // we need an HkdfCtrParams object as our first param when in fact we need a
  // HkdfParams object.)
  const derivedKeys = await window.crypto.subtle.deriveKey(algorithm, masterKey, derivedKeyAlgorithm, true, ['verify']);

  const derivedKeyBytes = await window.crypto.subtle.exportKey('raw', derivedKeys);
  return [derivedKeyBytes.slice(0, 32), derivedKeyBytes.slice(32, 64)];
}


/**
 * Decrypts a manifest returned from the Signal API using a sticker pack's
 * pack key, provided from stickers.json.
 */
export async function decryptManifest(encodedKey: string, rawManifest: any) {
  try {
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
  } catch (err) {
    throw new Error(`[decryptManifest] Failed to decrypt manifest: ${err.stack}`);
  }
}
