import bytes from 'bytes';


/**
 * Prints current storage usage and quotas to the console.
 */
export async function printStorageUsage() {
  if (process.env.NODE_ENV === 'development') {
    const storageEstimate = navigator.storage && await navigator.storage.estimate();

    // The navigator.storage object is undefined when using private mode in
    // Safari.
    if (!storageEstimate) {
      return;
    }

    // @ts-ignore (usageDetails is not typed correctly).
    const idbUsage = storageEstimate?.usageDetails?.indexedDB;
    const quota = storageEstimate.quota;

    if (idbUsage && quota) {
      const percentageUsed = ((idbUsage / quota) * 100).toFixed(2);
      console.debug(`IndexedDB is currently using ${bytes(idbUsage)} of data, or ${percentageUsed}% of the ${bytes(quota)} quota.`);
    }
  }
}
