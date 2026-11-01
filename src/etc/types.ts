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
 * Response of POST /v2/security-question.
 */
export interface SecurityQuestion {
  security_id: string;
  security_question: string;
}


/**
 * Response of GET /v2/packs/status.
 */
export interface PackStatus {
  pack_title: string;
  pack_id: string;
  status: 'ONLINE' | 'IN_REVIEW' | 'REFUSED';
  status_comments: string | null;
}


/**
 * Body of POST /v2/packs (contribute).
 */
export interface ContributePayload {
  pack: {
    id: string;
    key: string;
    source?: string;
    tags?: Array<string>;
    nsfw?: boolean;
    original?: boolean;
  };
  submitter_comments?: string;
  security_id: string;
  security_answer: string;
}


/**
 * Body of POST /v2/packs/report.
 */
export interface ReportPayload {
  pack_id: string;
  content: string;
  security_id: string;
  security_answer: string;
}


/**
 * Manifest as returned by the v2 pack list. Unlike the full StickerPackManifest
 * (from the Signal CDN), the cover is a plain id and falsy values are omitted.
 */
export interface StickerPackManifestPartial {
  title: string;
  author?: string;
  cover_id?: number;
}


/**
 * A sticker pack partial is a `StickerPack` whose `manifest` is the reduced
 * version returned by the v2 pack list (title, author and cover id) rather
 * than the full manifest fetched from the Signal CDN. This object is used for
 * searching, filtering, and displaying preview cards on the home page.
 */
export interface StickerPackPartial {
  manifest: StickerPackManifestPartial;
  meta: StickerPack['meta'];
}
