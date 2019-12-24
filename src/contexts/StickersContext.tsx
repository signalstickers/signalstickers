import React, {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {useRouteMatch} from 'react-router-dom';
import * as R from 'ramda';

import {StickerPack} from 'etc/types';
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
   * Current sticker pack, typically displayed by the sticker pack detail view
   * page.
   */
  currentStickerPack: StickerPack | undefined;

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
  const [currentStickerPack, setCurrentStickerPack] = useState<StickerPack | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<StickerPack>>([]);

  // Hooks from React Router DOM.
  const stickerPackPathMath = useRouteMatch<{packId?: string}>(`/pack/:packId`);


  // ----- [Effect] Load & Fetch Sticker Packs ---------------------------------

  useEffect(() => {
    const getStickerPacksEffect = async () => {
      // Load the set of sticker packs we need from stickers.json.
      const stickerPacksToLoad = await getStickerPackList();

      // Then, prime the cache by loading each sticker pack from the Signal API.
      await Promise.all(stickerPacksToLoad.map(({id}) => getStickerPack(id)));

      // Finally, set our search results by performing an initial fuzzy search.
      setSearchResults(R.sortBy(R.prop('title'), fuzzySearchStickerPacks(searchQuery)));
    };

    getStickerPacksEffect(); // tslint:disable-line no-floating-promises
  }, []);


  // ----- [Effect] Update Search Results --------------------------------------

  useEffect(() => {
    setSearchResults(R.sortBy(R.prop('title'), fuzzySearchStickerPacks(searchQuery)));
  }, [searchQuery]);


  // ----- [Effect] Set Sticker Pack When Route Matches ------------------------

  useEffect(() => {
    async function setStickerPackEffect() {
      if (stickerPackPathMath?.params?.packId) {
        const stickerPack = await getStickerPack(stickerPackPathMath.params.packId);
        setCurrentStickerPack(stickerPack);
      } else {
        setCurrentStickerPack(undefined);
      }
    }

    setStickerPackEffect(); // tslint:disable-line no-floating-promises
  }, [stickerPackPathMath]);


  // ----- Render --------------------------------------------------------------

  return (
    <Context.Provider value={{
      currentStickerPack,
      searchQuery,
      setSearchQuery,
      searchResults
    }}>{props.children}</Context.Provider>
  );
};


export default Context;
