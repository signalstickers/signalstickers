import * as R from 'ramda';
import React, {createContext, PropsWithChildren} from 'react';
import useAsyncEffect from 'use-async-effect';

import {StickerPackPartial} from 'etc/types';
import {getStickerPackDirectory} from 'lib/stickers';
import SearchFactory, {SearchResults, Search} from 'lib/search';


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
}


const Context = createContext<StickersContext>({} as any);


export const Provider = (props: PropsWithChildren<Record<string, unknown>>) => {
  const [allStickerPacks, setAllStickerPacks] = React.useState<StickersContext['allStickerPacks']>();
  const [searcher, setSearcher] = React.useState<Search<StickerPackPartial>>();
  const [searchQuery, setSearchQuery] = React.useState<StickersContext['searchQuery']>('');
  const [searchResults, setSearchResults] = React.useState<StickersContext['searchResults']>([]);


  /**
   * [Effect] When the context mounts, set the list of sticker packs from
   * stickerData.json and set-up the initial search results.
   */
  useAsyncEffect(async () => {
    // Load the set of sticker packs we need from stickerData.json.
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
        animated: ['meta', 'animated']
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
      setSearchResults(R.map(stickerPack => ({
        item: stickerPack
      }), allStickerPacks) as SearchResults<StickerPackPartial>);

      return;
    }

    setSearchResults(searcher.search(searchQuery));
  }, [
    allStickerPacks,
    searcher,
    searchQuery
  ]);


  // ----- Render --------------------------------------------------------------

  return (
    <Context.Provider
      value={{
        allStickerPacks,
        searcher,
        searchQuery,
        searchResults,
        setSearchQuery
      }}
    >
      {props.children}
    </Context.Provider>
  );
};


export default Context;
