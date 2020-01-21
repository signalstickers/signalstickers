import React, {createContext, PropsWithChildren, useEffect, useState} from 'react';
import * as R from 'ramda';
import useAsyncEffect from 'use-async-effect';

import {StickerPack} from 'etc/types';
import {
  getStickerPackDirectory,
  getStickerPack,
  fuzzySearchStickerPacks
} from 'lib/stickers';


/**
 * Shape of the object provided by this Context.
 */
export interface StickersProviderContext {
  /**
   * List of all sticker packs known to the application.
   */
  allStickerPacks: Array<StickerPack> | undefined;

  /**
   * Current search query. This is persisted here so that should the user return
   * to the search page, their query and results will be preserved.
   */
  searchQuery: string;

  /**
   * Current result set based on the current value of search Query.
   */
  searchResults: Array<StickerPack>;

  /**
   * Allows a consumer to set the current search query, which will in turn
   * update the current search results.
   */
  setSearchQuery(needle: string): void;
}


const Context = createContext<StickersProviderContext>({} as any);


export const Provider = (props: PropsWithChildren<{}>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<StickerPack>>([]);
  const [allStickerPacks, setAllStickerPacks] = useState<Array<StickerPack>>();


  /**
   * [Effect] When the component/context mounts, set the list of sticker
   * packs from stickerData.json and setup the initial search results.
   */
  useAsyncEffect(async () => {
    // Load the set of sticker packs we need from stickerData.json.
    const stickerPacks = await getStickerPackDirectory();

    // Set the canonical list of all sticker packs.
    setAllStickerPacks(stickerPacks);

    // Finally, set our search results to the set of all sticker packs,
    // using the default sort order (most recently added first).
    setSearchResults(stickerPacks);
  }, []);


  /**
   * [Effect] Update `searchResults` when `searchQuery` changes.
   */
  useEffect(() => {
    if (!allStickerPacks) {
      return;
    }

    const rawSearchResults = fuzzySearchStickerPacks(searchQuery, allStickerPacks);

    // Only call `setSearchResults` if our new results have actually changed.
    // This will save us superfluous re-renders.
    if (!R.equals(rawSearchResults, searchResults)) {
      setSearchResults(rawSearchResults);
    }
  }, [searchQuery]);


  // ----- Render --------------------------------------------------------------

  return (
    <Context.Provider value={{
      allStickerPacks,
      searchQuery,
      setSearchQuery,
      searchResults
    }}>{props.children}</Context.Provider>
  );
};


export default Context;
