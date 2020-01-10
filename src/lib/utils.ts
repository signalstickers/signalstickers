import bytes from 'bytes';

/**
 * Capitalizes the first letter of the provided string.
 */
export function capitalizeFirst(str: string) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}


/**
 * Prints current storage usage and quotas to the console.
 */
export async function printStorageUsage() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const storageEstimate = await navigator.storage.estimate();

  // @ts-ignore
  const idbUsage = storageEstimate?.usageDetails?.indexedDB;
  const quota = storageEstimate.quota;

  if (idbUsage && quota) {
    const percentageUsed = ((idbUsage / quota) * 100).toFixed(2);
    console.debug(`IndexedDB is currently using ${bytes(idbUsage)} of data, or ${percentageUsed}% of the ${bytes(quota)} quota.`);
  }
}
