import {StickerPackManifest} from '@signalstickers/stickers-client';


// ----- YAML Manifest ---------------------------------------------------------

/**
 * Shape of the stickers.yml manifest file.
 */
export interface StickerPackYaml {
  [index: string]: {
    key: string;
    source: string;
    tags: Array<string>;
    nsfw?: boolean;
    original?: boolean;
    animated?: boolean;
  };
}

/**
 * Shape of transformed objects when loaded from stickers.yml such that the
 * sticker pack ID is added to each object.
 */
export interface StickerPackMetadata {
  id: string;
  key: string;
  unlisted: boolean;
  source?: string;
  tags?: Array<string>;
  nsfw?: boolean;
  original?: boolean;
  animated?: boolean;
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
