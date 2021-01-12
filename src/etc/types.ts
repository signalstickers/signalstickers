import {StickerPackManifest} from '@signalstickers/stickers-client';


// ----- YAML Manifest ---------------------------------------------------------

/**
 * The stickers manifest is an object wherein each key represents a sticker pack
 * ID and each value is an object with the following shape.
 */
export interface StickerPackYaml {
  key: string;
  source?: string;
  tags?: Array<string>;
  nsfw?: boolean;
  original?: boolean;
  animated?: boolean;
}

/**
 * A sticker pack "metadata object" represents a single key/value pair from the
 * stickers manifest modified such that the key is added to the object as the
 * 'id' field.
 */
export interface StickerPackMetadata {
  id: string;
  key: StickerPackYaml['key'];
  source?: StickerPackYaml['source'];
  tags?: StickerPackYaml['tags'];
  nsfw?: StickerPackYaml['nsfw'];
  original?: StickerPackYaml['original'];
  animated?: StickerPackYaml['animated'];

  /**
   * This field is computed at runtime based on whether a pack exists in our
   * manifest or not.
   */
  unlisted: boolean;
}


// ----- Custom Objects --------------------------------------------------------

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
   * All information about the sticker pack from stickers.yml.
   */
  meta: StickerPackMetadata;

  /**
   * All information about the sticker pack loaded from the Signal API.
   */
  manifest: StickerPackManifest;
}


/**
 * A sticker pack partial is an object that contains all information for a
 * sticker pack from stickers.yml plus its title and author, which are fetched
 * from the Signal API.
 *
 * Sticker pack partials are used as the source of truth for searching,
 * filtering, and displaying preview cards on the home page.
 */
export interface StickerPackPartial {
  meta: StickerPack['meta'];
  manifest: Pick<StickerPackManifest, 'title' | 'author' | 'cover'>;
}
