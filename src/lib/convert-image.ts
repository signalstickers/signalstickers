/**
 * ===== Image Converter =======================================================
 *
 * This module is responsible for converting WebP images to PNG images on
 * browsers that do not support WebP. Because we will be getting multiple
 * simultaneous calls to this function when the site loads, we use an
 * asynchronous task queue to limit concurrency of image conversion jobs.
 */
import imageType from 'image-type';
import pQueue from 'p-queue';
import pWaitFor from 'p-wait-for';
import {detectWebpSupport} from 'webp-hero/dist/detect-webp-support';
import type { WebpMachine } from 'webp-hero/dist/webp-machine';


/**
 * Caches our WebP converter instance so we only import/instantiate it once.
 */
let converter: Promise<WebpMachine> | undefined;


/**
 * Dynamically imports web-hero, creates a converter instance, and returns a
 * Promise that resolves with the instance. This allows us to load this module
 * (which is rather large) only when we need to use it, and also ensures we only
 * import/instantiate it once.
 */
async function importWebpHero() {
  if (!converter) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    converter = new Promise(async resolve => {
      console.debug('IMPORT WEBP HERO');
      const modules = await Promise.all([
        import(
          /* webpackChunkName: "webp-hero" */
          'webp-hero/libwebp/dist/webp.js'
        ),
        import(
          /* webpackChunkName: "webp-hero-machine" */
          'webp-hero/dist/webp-machine'
        )
      ]);

      const {Webp} = modules[0];
      const {WebpMachine, defaultDetectWebpImage} = modules[1];

      // One of Webp Hero's dependencies seems to block user input when a
      // conversion is run. This fix can be found here:
      // See: https://github.com/chase-moskal/webp-hero/issues/18#issuecomment-560188272
      const webp = new Webp();
      webp.Module.doNotCaptureKeyboard = true;

      resolve(new WebpMachine({
        webp,
        webpSupport: detectWebpSupport(),
        detectWebpImage: defaultDetectWebpImage
      }));
    });
  }

  return converter;
}


// ----- Locals ----------------------------------------------------------------

/**
 * Ensures we check for WebP support only once.
 */
const hasWebpSupportPromise = detectWebpSupport();

/**
 * Module-local asynchronous queue facility that will allow us to limit the
 * number of concurrent image conversion operations.
 */
const imageConversionQueue = new pQueue({concurrency: 1});


// ----- Functions -------------------------------------------------------------

/**
 * Provided a UInt8Array or Buffer containing image data, returns the image's
 * MIME type.
 */
function getImageMimeType(rawImageData: Uint8Array | Buffer): string {
  const typeInfo = imageType(rawImageData);

  if (!typeInfo) {
    throw new Error('[getImageMimeType] Unable to determine MIME type of image.');
  }

  return typeInfo.mime;
}


/**
 * Converts a Uint8Array to a base-64 encoded string.
 */
function uInt8ToBase64(data: Uint8Array): string {
  let strData = '';

  for (const byte of data) {
    strData += String.fromCharCode(byte);
  }

  return btoa(strData);
}


/**
 * If the browser has WebP support, the image data is converted into a base-64
 * encoded string and returned. Otherwise, the image is converted to PNG using
 * webp-hero and returned as a base-64 encoded string. Both variants are
 * suitable for using in the "src" attribute of an img tag.
 */
export async function convertImage(rawImageData: Uint8Array) {
  const mimeType = getImageMimeType(rawImageData);
  const hasWebpSupport = await hasWebpSupportPromise;

  // If the image is WebP and the browser lacks support for WebP, convert the
  // image to PNG. This will take a noticeable amount of time/memory on the
  // user's machine, but is the only way we can display these images at this
  // time.
  if (mimeType === 'image/webp' && !hasWebpSupport) {
    return imageConversionQueue.add(async () => {
      try {
        const converter = await importWebpHero();
        // @ts-expect-error (`busy` is not an exposed member of WebpMachine.)
        await pWaitFor(() => converter.busy === false);
        return await converter.decode(rawImageData);
      } catch (err) {
        console.error(`[convertImage] Image conversion failed: ${err.message}`);
        throw err;
      }
    });
  }

  return `data:${mimeType};base64,${uInt8ToBase64(rawImageData)}`;
}
