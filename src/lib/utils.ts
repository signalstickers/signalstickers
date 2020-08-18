import bytes from 'bytes';
import * as R from 'ramda';

import {BOOTSTRAP_BREAKPOINTS} from 'etc/constants';


/**
 * Prints current storage usage and quotas to the console.
 */
export async function printStorageUsage() {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const storageEstimate = navigator.storage && await navigator.storage.estimate();

    // The navigator.storage object is undefined when using private mode in
    // Safari.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!storageEstimate) {
      return;
    }

    // @ts-ignore (usageDetails is not typed correctly).
    const idbUsage = storageEstimate?.usageDetails?.indexedDB;
    const quota = storageEstimate.quota;

    if (idbUsage && quota) {
      const percentageUsed = (idbUsage / quota * 100).toFixed(2);
      console.debug(`IndexedDB is currently using ${bytes(idbUsage)} of data, or ${percentageUsed}% of the ${bytes(quota)} quota.`);
    }
  }
}


/**
 * Bootstrap media query helper for CSS-in-JS.
 *
 * @example
 *
 * @media ${bp('sm')} {
 *   // ...
 * }
 */
export function bp(bpName: keyof typeof BOOTSTRAP_BREAKPOINTS, minMax: 'min' | 'max' = 'min') {
  const bpValue = BOOTSTRAP_BREAKPOINTS[bpName];

  if (bpValue === undefined) {
    throw new Error(`Invalid breakpoint: ${bpName}`);
  }

  const value = minMax === 'min' ? bpValue : bpValue - 1;

  return `(${minMax}-width: ${value}px)`;
}


/**
 * Used for analytics.
 */
export function sendBeacon() {
  if (process.env.NODE_ENV === 'production' ) {
    try {
      navigator.sendBeacon('https://ping.signalstickers.com/ping', '');
    } catch (err){
      console.log(`${err}. No worries, it's okay!`);
    }
  }
}


/**
 * Returns true if the provided error was thrown because the browser is blocking
 * use of local storage and/or other storage back-ends.
 */
export function isStorageUnavailableError(err: any) {
  const patterns = [
    // Firefox in private mode.
    /the quota has been exceeded/gi
  ];

  if (err?.message) {
    return Boolean(R.find(curPattern => R.test(curPattern, err.message), patterns));
  }

  return false;
}
