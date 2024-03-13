import { StickerPackManifest } from '@signalstickers/stickers-client';


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
 * A sticker pack contains all information about a sticker pack from
 * stickers.yml (StickerPackMetadata) plus its manifest as fetched from the
 * Signal API (StickerPackManifest).
 *
 * If the pack is "unlisted", its metadata
 * will only contain the pack's id and key.
 */
export interface StickerPack {
  /**
   * All information about the sticker pack loaded from the Signal API.
   */
  manifest: StickerPackManifest;

  /**
   * Additional information about the sticker pack from Signal Stickers.
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
