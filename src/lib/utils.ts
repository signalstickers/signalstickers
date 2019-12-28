/**
 * Capitalizes the first letter of the provided string.
 */
export function capitalizeFirst(str: string) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}
