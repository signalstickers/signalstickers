import * as R from 'ramda';
import React from 'react';
import useAsyncEffect from 'use-async-effect';

import { INITIAL_PACKS_LIMIT } from 'etc/constants';
import { StickerPackPartial, StickerPackMetadata } from 'etc/types';
import SearchFactory, { SearchResults, Search } from 'lib/search';
import { getStickerPackDirectory, getStickerPackDirectoryLimited } from 'lib/stickers';
import { AttributeQuery } from 'lib/search/types';

/**
 * Shape of the object provided by this Context.
 */
export interface StickersContext {
  /**
   * List of all sticker packs known to the application. Initially the first
   * INITIAL_PACKS_LIMIT packs, replaced by the full directory once it has
   * loaded.
   */
  allStickerPacks: Array<StickerPackPartial> | undefined;

  /**
   * True once the full sticker pack directory has loaded (or the full fetch
   * failed). Search and sort are only computed once this is true.
   */
  isDirectoryComplete: boolean;

  /**
   * Searcher instance. Always available (built from the current pack set, or
   * an empty collection before the first fetch resolves).
   */
  searcher: Search<StickerPackPartial>;

  /**
   * Current search query. This is persisted here so that should the user return
   * to the search page, their query and results will be preserved.
   */
  searchQuery: string;

  /**
   * Current result set based on the current value of search Query.
   */
  searchResults: SearchResults<StickerPackPartial>;

  /**
   * Allows a consumer to set the current search query, which will in turn
   * update the current search results.
   */
  setSearchQuery: (needle: string) => void;

  /**
   * Current sort order
   */
  sortOrder: string;

  /**
   * Allows a consumer to set the sort order
   */
  setSortOrder: (sortOrder: string) => void;

  /**
   * Either show or hide NSFW content
   */
  showNsfw: boolean;

  /**
   * Allow a consumer to show or hide NSFW content
   */
  setShowNsfw: (show: boolean) => void;

  /**
   * True when the current search query includes an editorschoice:true filter.
   */
  hasEditorsChoiceFilter: boolean;
}


const Context = React.createContext<StickersContext>({} as any);


export const Provider = (props: React.PropsWithChildren<Record<string, unknown>>) => {
  const [allStickerPacks, setAllStickerPacks] = React.useState<StickersContext['allStickerPacks']>();
  const [isDirectoryComplete, setIsDirectoryComplete] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState<StickersContext['searchQuery']>('');
  const [sortOrder, setSortOrder] = React.useState<StickersContext['sortOrder']>('');
  const [searchResults, setSearchResults] = React.useState<StickersContext['searchResults']>([]);
  const [showNsfw, setShowNsfw] = React.useState(false);

  // Searcher is always available (built from the current pack set, or an empty collection
  // before the first fetch resolves) so query building/parsing works from T0. It is rebuilt
  // as allStickerPacks goes undefined -> 64 -> full.
  const searcher = React.useMemo<Search<StickerPackPartial>>(() => SearchFactory({
    collection: allStickerPacks ?? [],
    identity: R.path(['meta', 'id']),
    keys: {
      title: ['manifest', 'title'],
      author: ['manifest', 'author'],
      tag: ['meta', 'tags'],
      nsfw: ['meta', 'nsfw'],
      original: ['meta', 'original'],
      animated: ['meta', 'animated'],
      editorschoice: ['meta', 'editorschoice']
    }
  }), [allStickerPacks]);

  /**
   * [Memo] True when the current search query includes an editorschoice:true
   * filter, regardless of other filters or text terms.
   */
  const hasEditorsChoiceFilter = React.useMemo(() => {
    if (searchQuery.length === 0) {
      return false;
    }
    const parsed = searcher.parseQueryString(searchQuery);
    return parsed.attributeQueries?.some(
      (aq: AttributeQuery) => aq.editorschoice === 'true'
    ) ?? false;
  }, [searcher, searchQuery]);


  /**
   * [Effect] Progressive directory load. Show the first page of packs as soon
   * as possible, then swap in the full directory when it lands.
   */
  useAsyncEffect(async () => {
    // Kick off the full-directory fetch in the background immediately.
    const fullPromise = getStickerPackDirectory().catch(err => {
      console.error('[StickersContext] Failed to load full sticker pack directory', err);
      return undefined;
    });

    // Show the first page of packs as soon as possible.
    const limited = await getStickerPackDirectoryLimited(INITIAL_PACKS_LIMIT);
    setAllStickerPacks(limited);

    // Swap in the full directory when it lands (keep the 64 if the full fetch failed).
    const full = await fullPromise;
    if (full) {
      setAllStickerPacks(full);
    }

    // Either way the directory is now complete enough to enable search/sort. Setting this
    // even on a full-fetch failure prevents the grid spinner from spinning forever; search
    // degrades gracefully to the 64-pack set.
    setIsDirectoryComplete(true);
  }, []);


  /**
   * [Effect] Update `searchResults` when the query, sort, or pack set changes.
   * The default view (no query, no sort) shows all available packs in the
   * API's default order; any other view only computes once the full directory
   * has loaded.
   */
  React.useEffect(() => {
    const isDefaultView = searchQuery.length === 0 && sortOrder === '';

    // Default view: show all available packs in the API's default order (the 64 before the
    // full directory lands, the full list after).
    if (isDefaultView) {
      setSearchResults(allStickerPacks
        ? R.map(stickerPack => ({ item: stickerPack }), allStickerPacks) as SearchResults<StickerPackPartial>
        : []);
      return;
    }

    // Non-default view (query or sort active): only compute once the full directory has
    // loaded. Searching/sorting the partial (64-pack) set is not meaningful, so the grid
    // shows a spinner until then.
    if (!isDirectoryComplete || !allStickerPacks) {
      return;
    }

    if (searchQuery.length > 0) {
      setSearchResults(searcher.search(searchQuery));
      return;
    }

    // Sort only (no query): sort the full list.
    let orderedSearchResults = R.map(stickerPack => ({ item: stickerPack }), allStickerPacks);

    let sortKey = ''; // Key to sort by in StickerPackMetadata
    switch (sortOrder) {
      case 'trending':
        sortKey = 'hotviews';
        break;
      case 'mostViewed':
        sortKey = 'totalviews';
        break;
    }

    if (sortKey) {
      orderedSearchResults = orderedSearchResults.sort((a, b) => (
        (a.item.meta[sortKey as keyof StickerPackMetadata] ?? 0) > (b.item.meta[sortKey as keyof StickerPackMetadata] ?? 0) ? -1 : 1
      ));
    }

    setSearchResults(orderedSearchResults as SearchResults<StickerPackPartial>);
  }, [
    allStickerPacks,
    searcher,
    searchQuery,
    sortOrder,
    showNsfw,
    isDirectoryComplete
  ]);


  // ----- Render --------------------------------------------------------------

  return (
    <Context.Provider
      value={{
        allStickerPacks,
        isDirectoryComplete,
        searcher,
        searchQuery,
        searchResults,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        showNsfw,
        setShowNsfw,
        hasEditorsChoiceFilter
      }}
    >
      {props.children}
    </Context.Provider>
  );
};


export default Context;
