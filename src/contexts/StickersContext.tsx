import * as R from 'ramda';
import React from 'react';
import useAsyncEffect from 'use-async-effect';

import { StickerPackPartial, StickerPackMetadata } from 'etc/types';
import SearchFactory, { SearchResults, Search } from 'lib/search';
import { getStickerPackDirectory } from 'lib/stickers';

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
  searcher?: Search<StickerPackPartial>;

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
}


const Context = React.createContext<StickersContext>({} as any);


export const Provider = (props: React.PropsWithChildren<Record<string, unknown>>) => {
  const [allStickerPacks, setAllStickerPacks] = React.useState<StickersContext['allStickerPacks']>();
  const [searcher, setSearcher] = React.useState<Search<StickerPackPartial>>();
  const [searchQuery, setSearchQuery] = React.useState<StickersContext['searchQuery']>('');
  const [sortOrder, setSortOrder] = React.useState<StickersContext['sortOrder']>('');
  const [searchResults, setSearchResults] = React.useState<StickersContext['searchResults']>([]);
  const [showNsfw, setShowNsfw] = React.useState(false);


  /**
   * [Effect] When the context mounts, set the list of sticker packs from
   * partials.json and set-up the initial search results.
   */
  useAsyncEffect(async () => {
    // Load the set of sticker packs we need from partials.json.
    const stickerPacks = await getStickerPackDirectory();

    // Set the canonical list of all sticker packs.
    setAllStickerPacks(stickerPacks);

    // Create a searcher using our collection of sticker pack partials.
    setSearcher(SearchFactory({
      collection: stickerPacks,
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
    }));
  }, []);


  /**
   * [Effect] Update `searchResults` when `searchQuery` changes. This effect
   * will also set the default set of search results to `allStickerPacks` if
   * there is no query.
   */
  React.useEffect(() => {
    if (!allStickerPacks || !searcher) {
      return;
    }


    // If there is currently no query, set the search results to the result of
    // mapping the full list of sticker packs into a list with the same shape
    // returned by the search function.
    if (searchQuery.length === 0) {
      // Default ordering
      let orderedSearchResults = R.map(stickerPack => ({
        item: stickerPack
      }), allStickerPacks);

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
      return;
    }

    setSearchResults(searcher.search(searchQuery));
  }, [
    allStickerPacks,
    searcher,
    searchQuery,
    sortOrder,
    showNsfw
  ]);


  // ----- Render --------------------------------------------------------------

  return (
    <Context.Provider
      // @ts-expect-error
      value={{
        allStickerPacks,
        searcher,
        searchQuery,
        searchResults,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        showNsfw,
        setShowNsfw
      }}
    >
      {props.children}
    </Context.Provider>
  );
};


export default Context;
