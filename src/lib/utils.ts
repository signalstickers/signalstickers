import bytes from 'bytes';
import * as R from 'ramda';

import { BOOTSTRAP_BREAKPOINTS, API_URL_PACKS_PING } from 'etc/constants';

import type { BootstrapBreakpoint } from 'etc/types';


/**
 * Prints current storage usage and quotas to the console.
 */
export async function printStorageUsage() {
  if (import.meta.env.NODE_ENV === 'development') {
    const storageEstimate = navigator.storage && await navigator.storage.estimate();

    // The navigator.storage object is undefined when using private mode in
    // Safari.
    if (!storageEstimate) return;

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
 * Bootstrap media query helper for CSS-in-JS. By default, the resulting media
 * query will target the indicated breakpoint and all breakpoints above it,
 * which is in accordance with how Bootstrap utility classes work. It is also
 * possible to target a breakpoint and all breakpoints below it by providing
 * `'max'` as a second parameter.
 *
 * @example
 *
 * style({
 *   '@media': {
 *     [bp('sm')]: {
 *       color: 'var(--bs-primary)'
 *     }
 *   }
 * });
 */
export function bp(bpName: BootstrapBreakpoint, minMax: 'min' | 'max' = 'min') {
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
export function sendPackBeacon(packId: string) {
  if (import.meta.env.NODE_ENV === 'production') {
    try {
      const beaconData = new Blob([`target=${packId}`], { type: 'application/x-www-form-urlencoded' });
      navigator.sendBeacon(API_URL_PACKS_PING, beaconData);
    } catch (err: any) {
      console.log(`${err}. No worries, it's okay!`);
    }
  }
}


/**
 * Used for analytics.
 */
export function sendHomeBeacon() {
  sendPackBeacon('home');
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
