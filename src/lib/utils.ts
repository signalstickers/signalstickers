import bytes from 'bytes';
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
export function bp(bpName: string, minMax: 'min' | 'max' = 'min') {
  // @ts-ignore
  const bpValue = BOOTSTRAP_BREAKPOINTS[bpName];

  if (!bpValue) {
    throw new Error(`Invalid breakpoint: ${bpName}`);
  }

  const value = minMax === 'min' ? bpValue : bpValue - 1;

  return `(${minMax}-width: ${value}px)`;
}
