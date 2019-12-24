// ----- JSON Manifest ---------------------------------------------------------

/**
 * Shape of the stickers.json manifest file.
 */
export interface StickerPackJson {
  [index: string]: {
    key: string;
    source: string;
    tags: string;
    nsfw?: boolean;
  };
}


/**
 * Shape of transformed objects when loaded from stickers.json such that the
 * sticker pack ID is added to each object.
 */
export interface TransformedStickerPackJsonEntry {
  id: string;
  key: string;
  source: string;
  tags: string;
  nsfw?: boolean;
}


// ----- Signal CDN Responses --------------------------------------------------

/**
 * Shape of an individual sticker in a sticker pack response.
 */
export interface Sticker {
  id: number;
  emoji: string;
}


/**
 * Response from the Signal CDN when requesting a sticker pack.
 */
export interface StickerPackManifest {
  title: string;
  author: string;
  cover: Sticker;
  stickers: Array<Sticker>;
}


// ----- Custom Objects --------------------------------------------------------

export interface StickerPack {
  /**
   * ID of the sticker pack.
   *
   * Loaded from stickers.json.
   */
  id: string;

  /**
   * "Pack key" for the sticker pack.
   *
   * Loaded from stickers.json.
   */
  key: string;

  /**
   * Original source for the sticker pack.
   *
   * Loaded from stickers.json.
   */
  source: string;

  /**
   * Comma-delimited list of tags for the sticker pack.
   *
   * Loaded from stickers.json.
   */
  tags: string;

  /**
   * Title of the sticker pack.
   */
  title: string;

  /**
   * Author of the sticker pack.
   */
  author: string;

  /**
   * Sticker that serves as the cover/primary sticker for the sticker pack.
   */
  cover: Sticker;

  /**
   * Whether the sticker pack is NSFW.
   */
  nsfw?: boolean;

  /**
   * List of all stickers in the sticker pack.
   */
  stickers: Array<Sticker>;
}
