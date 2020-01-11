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
 * Shape of the stickerData.json file.
 */
export interface StickerPackDataJson {
  [index: string]: {
    metadata: StickerPackMetadata;
    manifest: StickerPackManifest;
  };
}

/**
 * Shape of transformed objects when loaded from stickers.json such that the
 * sticker pack ID is added to each object.
 */
export interface StickerPackMetadata {
  id: string;
  key: string;
  source: string;
  tags: string;
  nsfw?: boolean;
}


// ----- Signal API Responses --------------------------------------------------

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
   * List of all stickers in the sticker pack.
   */
  stickers: Array<Sticker>;
}


// ----- Custom Objects --------------------------------------------------------

export interface StickerPack {
  /**
   * All information about the sticker pack from stickers.json.
   */
  meta: StickerPackMetadata;

  /**
   * All information about the sticker pack loaded from the Signal API.
   */
  manifest: StickerPackManifest;
}
