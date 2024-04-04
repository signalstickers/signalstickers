import * as R from 'ramda';
import React from 'react';
import useAsyncEffect from 'use-async-effect';

import AppStateContext from 'contexts/AppStateContext';
import SearchFactory, { type Searcher } from 'lib/search';
import { getStickerPackDirectory } from 'lib/stickers';

import type { StickerPackPartial, SortOrder } from 'etc/types';


/**
 * Shape of the object provided by this Context.
 */
export interface StickersContext {
  /**
   * List of all sticker packs known to the application.
   */
  allStickerPacks: Array<StickerPackPartial> | undefined;

  /**
   * Searcher instance.
   */
  searcher: Searcher<StickerPackPartial> | undefined;

  /**
   * Current search query. This is persisted here so that should the user return
   * to the search page, their query and results will be preserved.
   */
  searchQuery: string;

  /**
   * Current result set based on the current value of search Query.
   */
  searchResults: Array<StickerPackPartial>;

  /**
   * Allows a consumer to set the current search query, which will in turn
   * update the current search results.
   */
  setSearchQuery: (needle: string) => void;
}


const Context = React.createContext<StickersContext>({} as any);


export function Provider(props: React.PropsWithChildren<Record<string, unknown>>) {
  const { useAppState } = React.useContext(AppStateContext);
  const [allStickerPacks, setAllStickerPacks] = React.useState<StickersContext['allStickerPacks']>();
  const [searcher, setSearcher] = React.useState<Searcher<StickerPackPartial>>();
  const [searchQuery, setSearchQuery] = React.useState<StickersContext['searchQuery']>('');
  const [searchResults, setSearchResults] = React.useState<StickersContext['searchResults']>([]);
  const [sortOrder, setSortOrder] = useAppState<SortOrder>('sortOrder');
  const [showNsfw] = useAppState<boolean>('showNsfw');


  /**
   * [Effect] When the context mounts, set the list of sticker packs from
   * partials.json and set-up the initial search results.
   */
  useAsyncEffect(async isMounted => {
    // Load the set of sticker packs we need from partials.json.
    const stickerPacks = await getStickerPackDirectory();

    if (!isMounted()) return;

    // Set the canonical list of all sticker packs.
    setAllStickerPacks(stickerPacks);

    // Create a searcher using our collection of sticker pack partials.
    setSearcher(SearchFactory({
      collection: stickerPacks,
      identity: R.path(['meta', 'id']),
      keys: [{
        name: 'title',
        getFn: pack => pack.manifest.title
      }, {
        name: 'author',
        getFn: pack => pack.manifest.author
      }, {
        name: 'tag',
        getFn: pack => pack.meta.tags ?? [],
        weight: 3
      }, {
        name: 'nsfw',
        getFn: pack => pack.meta.nsfw ? 'true' : 'false',
        weight: 0.25
      }, {
        name: 'original',
        getFn: pack => pack.meta.original ? 'true' : 'false',
        weight: 0.25
      }, {
        name: 'animated',
        getFn: pack => pack.meta.animated ? 'true' : 'false',
        weight: 0.25
      }, {
        name: 'editorschoice',
        getFn: pack => pack.meta.editorschoice ? 'true' : 'false',
        weight: 0.25
      }]
    }));
  }, []);


  // ----- Setting & Restoring Sort Order --------------------------------------

  const [previousSearchQuery, setPreviousSearchQuery] = React.useState<StickersContext['searchQuery']>('');
  const [previousSortOrder, setPreviousSortOrder] = React.useState<SortOrder>();


  /**
   * [Effect] Tracks the last known search query.
   */
  React.useEffect(() => {
    setPreviousSearchQuery(searchQuery);
  }, [searchQuery]);


  /**
   * [Effect] Tracks the last known sort order that was not "relevance".
   */
  React.useEffect(() => {
    if (sortOrder && sortOrder !== 'relevance') setPreviousSortOrder(sortOrder);
  }, [sortOrder]);


  /**
   * [Effect] Combined with the above two effects, this will set the sort order
   * to "relevance" when the user initially enters a search query. The user will
   * then be able to change the search query and sort order to their liking.
   * When the search query is cleared, we check if the sort order is "relevance"
   * and, if so, set it back to its last known value.
   */
  React.useEffect(() => {
    // When the search query is cleared and the sort order is "relevance",
    // restore sort order to its last known value or the default value.
    if (!searchQuery && sortOrder === 'relevance') {
      setSortOrder(previousSortOrder ?? 'latest');
      return;
    }

    // Otherwise, if the previous search query was empty and the new search
    // query is non-empty, then set the sort order to "relevance".
    if (!previousSearchQuery && searchQuery && sortOrder !== 'relevance') {
      setSortOrder('relevance');
      return;
    }
  }, [
    searchQuery,
    previousSearchQuery,
    sortOrder,
    previousSortOrder
  ]);


  // ----- Filtering & Sorting Search Results ----------------------------------

  /**
   * [Effect] Update `searchResults` when `searchQuery`, `sortOrder`, or
   * `showNsfw` changes.
   */
  React.useEffect(() => {
    if (!allStickerPacks || !searcher) return;

    // Start with all packs if there is no query. Otherwise, start with search
    // results.
    let searchResults = searchQuery
      ? searcher.search(searchQuery)
      // This temporarily maps sticker packs into a shape similar to that which
      // we get from search results so that we can filter and sort them in a
      // uniform way before mapping them back into a collection of sticker packs
      // before setting state.
      : R.map(pack => ({ item: pack }), allStickerPacks);

    // Remove NSFW packs if the user has opted to hide them.
    if (!showNsfw) searchResults = R.reject(R.pathEq(true, ['item', 'meta', 'nsfw']), searchResults);

    // Use the "Latest" (default) sort order.
    if (sortOrder === 'latest') {
      setSearchResults(R.map(R.prop('item'), searchResults));
      return;
    }

    // Sort in descending order by hot views.
    if (sortOrder === 'trending') {
      const sortedResults = R.sort(R.descend(R.pathOr(0, ['item', 'meta', 'hotviews'])), searchResults);
      setSearchResults(R.map(R.prop('item'), sortedResults));
      return;
    }

    // Sort in descending order by total views.
    if (sortOrder === 'mostViewed') {
      const sortedResults = R.sort(R.descend(R.pathOr(0, ['item', 'meta', 'totalviews'])), searchResults);
      setSearchResults(R.map(R.prop('item'), sortedResults));
      return;
    }

    if (sortOrder === 'relevance') {
      // Note: Fuse.js uses 0 for a perfect match and 1 for a non-match, so we
      // are still technically sorting in descending order by relevance here.
      const sortedResults = R.sort(R.ascend(R.pathOr(0, ['score'])), searchResults);
      setSearchResults(R.map(R.prop('item'), sortedResults));
      return;
    }
  }, [
    allStickerPacks,
    searcher,
    searchQuery,
    sortOrder,
    showNsfw
  ]);


  return (
    <Context.Provider
      value={{
        allStickerPacks,
        searcher,
        searchQuery,
        setSearchQuery,
        searchResults
      }}
    >
      {props.children}
    </Context.Provider>
  );
}


export default Context;
