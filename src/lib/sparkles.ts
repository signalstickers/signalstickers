/**
 * Deterministic hash from string to number in [0, 1).
 * Seeded with packId so each card gets a unique, stable sparkle layout.
 */
export function hash(str: string, seed: number): number {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return ((h % 10000) / 10000 + 10000) % 1;
}


/**
 * Generate a set of sparkle configs, unique per ID.
 *
 * Each sparkle gets a negative delay that is evenly distributed across its
 * cycle duration so they fire one at a time rather than in groups.
 *
 * @param id unique identifier for deterministic positioning
 * @param count number of sparkles (density)
 */
export function generateSparkles(id: string, count: number = 16) {
  /** Spread delays evenly: sparkle i fires at phase i/count of the cycle. */
  const phase = (i: number) => i / count;

  return Array.from({ length: count }, (_, i) => {
    const h1 = hash(id, i * 7919);
    const h2 = hash(id, i * 10472 + 1);
    const h3 = hash(id, i * 13003 + 2);
    const h4 = hash(id, i * 16007 + 3);

    const duration = 3 + hash(id, i * 19531 + 4) * 2; // 3-5s

    return {
      top: `${h1 * 100}%`,
      left: `${h2 * 100}%`,
      fontSize: `${8 + h3 * 12}px`,
      opacity: 0.5 + h4 * 0.45,
      duration: `${duration}s`,
      /**
       * Negative delay offset by a regular phase so sparkles are evenly
       * staggered. A small jitter (±10% of one slot) keeps it organic.
       */
      delay: `-${(phase(i) + hash(id, i * 23003 + 5) * 0.2) * duration}s`
    };
  });
}
