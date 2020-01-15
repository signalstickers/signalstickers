/**
 * ===== Image Converter =======================================================
 *
 * This module is responsible for converting WebP images to PNG images on
 * browsers that do not support WebP. Because we will be getting multiple
 * simultaneous calls to this function when the site loads, we use an
 * asynchronous task queue to limit concurrency of image conversion jobs.
 */
import pQueue from 'p-queue';
import pWaitFor from 'p-wait-for';
import {
  WebpMachine,
  detectWebpSupport,
  defaultDetectWebpImage
} from 'webp-hero';
import {Webp} from 'webp-hero/libwebp/dist/webp.js';


// ----- Fixed Webp Instance ---------------------------------------------------

/**
 * One of Webp Hero's dependencies seems to block user input when a conversion
 * is run. This fix can be found here:
 *
 * https://github.com/chase-moskal/webp-hero/issues/18#issuecomment-560188272
 */
const webp = new Webp();
webp.Module.doNotCaptureKeyboard = true;


// ----- Locals ----------------------------------------------------------------

/**
 * Module-local WepP to PNG converter.
 */
const webpConverter = new WebpMachine({
  webp,
  webpSupport: detectWebpSupport(),
  detectWebpImage: defaultDetectWebpImage
});

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
 * Resolves with `true` if the browser supports WebP or `false` otherwise.
 */
export async function hasWebpSupport() {
  return hasWebpSupportPromise;
}


/**
 * If the browser has WebP support, the image data is converted into a base-64
 * encoded string and returned. Otherwise, the image is converted to PNG using
 * webp-hero and returned as a base-64 encoded string. Both variants are
 * suitable for using in the "src" attribute of an img tag.
 */
export async function convertImage(rawImageData: Uint8Array) {
  if (await hasWebpSupportPromise) {
    // If the browser supports WebP, we don't need to convert it to PNG.
    const base64Data = btoa(String.fromCharCode.apply(undefined, rawImageData));
    return `data:image/webp;base64,${base64Data}`;
  }

  // Otherwise, convert the WEBP image to PNG. This will take a noticeable
  // amount of time/memory on the user's machine, but is the only way we can
  // display these images at this time.
  return imageConversionQueue.add(async () => {
    try {
      // @ts-ignore (`busy` is not an exposed member of WebpMachine.)
      await pWaitFor(() => webpConverter.busy === false);

      return await webpConverter.decode(rawImageData);
    } catch (err) {
      console.error(`[convertImage] Image conversion failed: ${err.message}`);
      throw err;
    }
  });
}
