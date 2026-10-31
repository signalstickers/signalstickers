import React from 'react';

import PackCardLink from 'components/general/PackCardLink';
import StickersContext from 'contexts/StickersContext';
import { StickerPack, StickerPackPartial } from 'etc/types';

import classes from './SeeAlso.css';


/**
 * Maximum number of tag sections to display.
 */
const MAX_SECTIONS = 3;

/**
 * Maximum number of packs to display in a single section.
 */
const MAX_PACKS_PER_SECTION = 4;

/**
 * Size of the pool (top packs by views this month) the "More trending packs"
 * section's packs are randomly chosen from.
 */
const TRENDING_POOL_SIZE = 50;

/**
 * Tag marking packs that are suitable for children. Matches are
 * case-insensitive.
 */
const FOR_CHILDREN_TAG = 'for children';

/**
 * Number of packs displayed in the "More packs for children" section (2 rows
 * of MAX_PACKS_PER_SECTION packs).
 */
const CHILDREN_PACKS_PER_SECTION = MAX_PACKS_PER_SECTION * 2;


export interface Props {
  stickerPack: StickerPack;
}


/**
 * A single "see also" section: a title plus the packs recommended for it.
 */
interface Section {
  /**
   * Unique key for this section: its tag, 'for-children' for the children
   * section, or 'trending' for the fallback section.
   */
  key: string;

  title: string;
  packs: Array<StickerPackPartial>;
}


/**
 * Returns up to `k` packs from `bucket`, ordered by views last month
 * (descending), skipping packs whose id is in `exclude` and, unless
 * `showNsfw` is true, NSFW packs.
 *
 * This is a linear O(n) selection rather than a full O(n log n) sort: callers
 * only ever need a handful of packs out of buckets that may contain thousands
 * of them. Ties on views are broken by position in `bucket`, mirroring a
 * stable sort.
 */
function topPacks(
  bucket: Array<StickerPackPartial>,
  k: number,
  exclude: Set<string>,
  showNsfw: boolean
): Array<StickerPackPartial> {
  const top: Array<StickerPackPartial> = [];

  for (const pack of bucket) {
    if (exclude.has(pack.meta.id) || (pack.meta.nsfw && !showNsfw)) {
      continue;
    }

    // Insertion point: the first slot holding a pack with strictly fewer
    // views, so packs with equal views keep their relative order.
    let i = top.length;
    while (i > 0 && (top[i - 1].meta.hotviews ?? 0) < (pack.meta.hotviews ?? 0)) {
      i--;
    }

    top.splice(i, 0, pack);

    if (top.length > k) {
      top.pop();
    }
  }

  return top;
}


/**
 * Randomly picks up to `k` packs from `pool`, without duplicates (partial
 * Fisher-Yates shuffle). `pool` is consumed in place.
 *
 * The randomness is intentional: a fresh draw is made on every visit to a
 * pack page, so each reload proposes a different set of packs.
 */
function randomPacks(
  pool: Array<StickerPackPartial>,
  k: number
): Array<StickerPackPartial> {
  const picked: Array<StickerPackPartial> = [];

  while (picked.length < k && pool.length > 0) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }

  return picked;
}


export default function SeeAlso(props: Props) {
  const { allStickerPacks, showNsfw } = React.useContext(StickersContext);
  const { stickerPack } = props;


  /**
   * [Memo] Index of all packs by tag. `allStickerPacks` is only set once, at
   * startup, so this index is built once per app load and makes per-visit
   * section building O(directory size) at most, instead of O(directory size)
   * per tag of the current pack.
   */
  const packsByTag = React.useMemo(() => {
    const index = new Map<string, Array<StickerPackPartial>>();

    for (const pack of allStickerPacks ?? []) {
      for (const tag of pack.meta.tags ?? []) {
        let bucket = index.get(tag);

        if (!bucket) {
          bucket = [];
          index.set(tag, bucket);
        }

        bucket.push(pack);
      }
    }

    return index;
  }, [
    allStickerPacks
  ]);


  /**
   * [Memo] Compute the list of sections to display.
   *
   * When one of the current pack's tags is "for children" (case insensitive),
   * a single "More packs for children" section is displayed with up to
   * CHILDREN_PACKS_PER_SECTION packs randomly chosen from all packs sharing
   * that tag. No tag-based or trending suggestions are made for such packs.
   *
   * Otherwise, for each tag of the current pack, collect the other packs
   * sharing that tag (respecting the NSFW filter). The top MAX_SECTIONS tags
   * by candidate count are kept and each yields up to MAX_PACKS_PER_SECTION
   * packs randomly chosen from the tag's top TRENDING_POOL_SIZE packs by
   * views last month, with packs already shown in a previous section
   * skipped.
   *
   * When fewer than MAX_SECTIONS tag sections are available, a "More
   * trending packs" section is added with up to MAX_PACKS_PER_SECTION packs
   * randomly chosen from the top TRENDING_POOL_SIZE packs by views this
   * month. The randomness is intentional: a fresh draw is made on every visit
   * to the pack page (this memo is recomputed whenever the pack changes).
   */
  const sections = React.useMemo<Section[]>(() => {
    if (!allStickerPacks) {
      return [];
    }

    const currentPackId = stickerPack.meta.id;
    const tags = stickerPack.meta.tags;

    // Packs that must not be recommended: the current pack, plus every pack
    // already shown in a previous section.
    const excludedPackIds = new Set<string>([currentPackId]);
    const result: Section[] = [];

    // Whether one of the current pack's tags marks it as suitable for
    // children (case insensitive).
    const isForChildrenPack = (tags ?? []).some(tag => tag.toLowerCase() === FOR_CHILDREN_TAG);

    if (isForChildrenPack) {
      // For children packs, skip tag-based and trending suggestions
      // entirely: only recommend other children packs, chosen randomly from
      // all packs sharing the tag (respecting the NSFW filter).
      const childrenPacks = allStickerPacks.filter(pack => {
        if (pack.meta.id === currentPackId || (pack.meta.nsfw && !showNsfw)) {
          return false;
        }

        return (pack.meta.tags ?? []).some(tag => tag.toLowerCase() === FOR_CHILDREN_TAG);
      });

      const packs = randomPacks(childrenPacks, CHILDREN_PACKS_PER_SECTION);

      if (packs.length > 0) {
        result.push({
          key: 'for-children',
          title: 'More packs for children',
          packs
        });
      }

      return result;
    }

    if (tags && tags.length > 0) {
      // Rank the current pack's tags by how many other packs share them
      // (respecting the NSFW filter), most shared first, and keep the top
      // ones.
      const topTags = tags
        .map(tag => {
          const bucket = packsByTag.get(tag);

          if (!bucket) {
            return null;
          }

          let count = 0;

          for (const pack of bucket) {
            if (pack.meta.id !== currentPackId && (!pack.meta.nsfw || showNsfw)) {
              count++;
            }
          }

          return count > 0 ? { tag, bucket, count } : null;
        })
        .filter((entry): entry is { tag: string; bucket: Array<StickerPackPartial>; count: number } =>
          entry !== null
        )
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_SECTIONS);

      // Build the sections, skipping packs already shown in a previous
      // section. Each section's packs are randomly picked from the tag's
      // trending pool (top TRENDING_POOL_SIZE packs by views last month), so
      // each visit proposes a different set.
      topTags.forEach(({ tag, bucket }) => {
        const pool = topPacks(bucket, TRENDING_POOL_SIZE, excludedPackIds, showNsfw);
        const packs = randomPacks(pool, MAX_PACKS_PER_SECTION);

        packs.forEach(pack => excludedPackIds.add(pack.meta.id));

        if (packs.length > 0) {
          result.push({
            key: tag,
            title: `More packs with tag "${tag}"`,
            packs
          });
        }
      });
    }

    // Fallback: when fewer than MAX_SECTIONS tag sections are available (ex:
    // the current pack's tags are not shared by any other pack, or the pack
    // has no tags), add a "More trending packs" section with up to
    // MAX_PACKS_PER_SECTION packs randomly chosen from the top
    // TRENDING_POOL_SIZE packs by views this month.
    if (result.length < MAX_SECTIONS) {
      const pool = topPacks(allStickerPacks, TRENDING_POOL_SIZE, excludedPackIds, showNsfw);
      const trending = randomPacks(pool, MAX_PACKS_PER_SECTION);

      if (trending.length > 0) {
        result.push({
          key: 'trending',
          title: 'More trending packs',
          packs: trending
        });
      }
    }

    return result;
  }, [
    allStickerPacks,
    packsByTag,
    showNsfw,
    stickerPack
  ]);


  if (sections.length === 0) {
    return null;
  }


  return (
    <div className={classes.seeAlso}>
      {sections.map(({ key, title, packs }) => (
        <section key={key} className="mb-4">
          <h2 className={classes.sectionTitle}>
            {title}
          </h2>
          <div className="row">
            {packs.map(pack => (
              <div
                key={pack.meta.id}
                className="col-6 col-md-3 mb-4"
              >
                <PackCardLink stickerPack={pack} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
