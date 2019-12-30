import React, {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import * as R from 'ramda';

import {
  StickerPack,
  StickerPackManifest
} from 'etc/types';

import {
  getStickerPackList,
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
   * ID of the current sticker pack, as extracted from our route parameters.
   * This is tracked separately from `currentStickerPack` because we may get a
   * pack ID that does not correlate to a known or valid sticker pack, in which
   * case we will want to use the ID we got to display contextual error
   * messages.
   */
  currentStickerPackId: string | undefined;

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
  const [currentStickerPackId, setCurrentStickerPackId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<StickerPack>>([]);
  const [allStickerPacks, setAllStickerPacks] = useState<Array<StickerPack>>();

  // Hooks from React Router DOM.
  const stickerPackPathMatch = useRouteMatch<{packId?: string}>(`/pack/:packId`);


  /**
   * [Effect] When the component/context mounts, iterate through each
   * StickerPackMetadata object from stickers.json and load a corresponding
   * StickerPackManifest from Signal. Then, cache each result as a StickerPack
   * object, which we will then use when searching.
   */
  useEffect(() => {
    const getStickerPacksEffect = async () => {
      // Load the set of sticker packs we need from stickers.json.
      const stickerPacksToLoad = await getStickerPackList();

      // Then, prime the cache by loading each sticker pack from the Signal API.
      const stickerPacks = await Promise.all(stickerPacksToLoad.map(async meta => {
        const manifest = await getStickerPack(meta.id, meta.key);

        return {
          meta,
          manifest
        } as StickerPack;
      }));

      // Set the canonical list of all sticker packs.
      setAllStickerPacks(stickerPacks);

      // Finally, set our search results to the set of all sticker packs.
      setSearchResults(R.sortBy(R.path<any>(['manifest', 'title']), stickerPacks));
    };

    getStickerPacksEffect(); // tslint:disable-line no-floating-promises
  }, []);


  /**
   * [Effect] Update `searchResults` when `searchQuery` changes.
   */
  useEffect(() => {
    if (!allStickerPacks) {
      return;
    }

    const rawSearchResults = fuzzySearchStickerPacks(searchQuery, allStickerPacks);
    const sortedSearchResults = R.sortBy(R.path<any>(['manifest', 'title']), rawSearchResults);
    setSearchResults(sortedSearchResults);
  }, [searchQuery]);


  /**
   * [Effect] Update `currentStickerPackId` based on our URL route params.
   */
  useEffect(() => {
    if (stickerPackPathMatch?.params?.packId) {
      setCurrentStickerPackId(stickerPackPathMatch.params.packId);
    } else {
      setCurrentStickerPackId('');
    }
  }, [stickerPackPathMatch]);


  // ----- Render --------------------------------------------------------------

  return (
    <Context.Provider value={{
      allStickerPacks,
      currentStickerPackId,
      searchQuery,
      setSearchQuery,
      searchResults
    }}>{props.children}</Context.Provider>
  );
};


export default Context;
