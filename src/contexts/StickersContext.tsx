import * as R from 'ramda';
import React from 'react';
import useAsyncEffect from 'use-async-effect';

import AppStateContext from 'contexts/AppStateContext';
import SearchFactory, { Search } from 'lib/search';
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
  searcher: Search<StickerPackPartial> | undefined;

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
  const [searcher, setSearcher] = React.useState<Search<StickerPackPartial>>();
  const [searchQuery, setSearchQuery] = React.useState<StickersContext['searchQuery']>('');
  const [searchResults, setSearchResults] = React.useState<StickersContext['searchResults']>([]);
  const [sortOrder] = useAppState<SortOrder>('sortOrder');
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
   * [Effect] Update `searchResults` when `searchQuery`, `sortOrder`, or
   * `showNsfw` changes.
   */
  React.useEffect(() => {
    if (!allStickerPacks || !searcher) return;

    // Start with all packs if there is no query. Otherwise, start with search
    // results.
    let searchResults = searchQuery
      ? R.map(R.prop('item'), searcher.search(searchQuery))
      : allStickerPacks;

    // Remove NSFW packs if the user has opted to hide them.
    if (!showNsfw) searchResults = R.reject(R.pathEq(true, ['meta', 'nsfw']), searchResults);

    // Use the "Latest"/default sort order.
    if (!sortOrder) {
      setSearchResults(searchResults);
      return;
    }

    // Sort in descending order by hotviews.
    if (sortOrder === 'trending') {
      setSearchResults(R.sort(R.descend(R.pathOr(0, ['meta', 'hotviews'])), searchResults));
      return;
    }

    // Sort in descending order by totalviews.
    if (sortOrder === 'mostViewed') {
      setSearchResults(R.sort(R.descend(R.pathOr(0, ['meta', 'totalviews'])), searchResults));
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
        searchResults,
        setSearchQuery
      }}
    >
      {props.children}
    </Context.Provider>
  );
}


export default Context;
