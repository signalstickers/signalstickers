import { StickerPackManifest } from '@signalstickers/stickers-client';

import type { BOOTSTRAP_BREAKPOINTS } from 'etc/constants';


/**
 * Union of allowed breakpoint names.
 */
export type BootstrapBreakpoint = keyof typeof BOOTSTRAP_BREAKPOINTS;


/**
 * Additional data about a sticker pack tracked by Signal Stickers.
 */
export interface StickerPackMetadata {
  id: string;
  key: string;
  source?: string;
  tags?: Array<string>;
  nsfw?: boolean;
  original?: boolean;
  animated?: boolean;
  editorschoice?: boolean;
  hotviews?: number;
  totalviews?: number;

  /**
   * This field is computed at runtime based on whether a pack exists in our
   * manifest or not.
   */
  unlisted: boolean;
}


/**
 * A sticker pack contains all information about a sticker pack from the Signal
 * API as fetched from `stickers-client` plus metadata about the pack from our
 * directory. If the pack is "unlisted" (it has not been submitted to our
 * directory) its metadata will only contain the pack's `id` and `key`, which
 * will have been provided explicitly in the URL by the user.
 */
export interface StickerPack {
  /**
   * All information about the sticker pack from the Signal API.
   */
  manifest: StickerPackManifest;

  /**
   * Additional information about the sticker pack from our directory.
   */
  meta: StickerPackMetadata;
}


/**
 * A sticker pack partial is a `StickerPack` whose `manifest` (from Signal) with
 * its `stickers` omitted. This object is used for searching, filtering, and
 * displaying preview cards on the home page.
 */
export interface StickerPackPartial {
  manifest: Omit<StickerPackManifest, 'stickers'>;
  meta: StickerPack['meta'];
}


/**
 * Valid sort-by values, persisted in Local Storage.
 */
export type SortOrder = 'latest' | 'trending' | 'mostViewed' | 'relevance';
