import React from 'react';

import Context from 'contexts/StickersContext';
import useQuery from 'hooks/use-query';
import useUpdateUrl from 'hooks/use-update-url';

import {SEARCH_QUERY_PARAM} from 'etc/constants';

import SearchInput from './SearchInput';
import StickerPackList from './SearchResults';


const HomeComponent: React.FunctionComponent = () => {
  const {searchQuery, setSearchQuery} = React.useContext(Context);
  const query = useQuery();
  const updateUrl = useUpdateUrl();


  /**
   * Perform a one-time URL-to-state sync when the component mounts.
   */
  React.useEffect(() => {
    const searchQueryFromUrl = query?.SEARCH_QUERY_PARAM;

    if (typeof searchQueryFromUrl === 'string') {
      setSearchQuery(searchQueryFromUrl);
    }
  }, []);


  /**
   * Perform a state-to-URL sync when the search query changes.
   */
  React.useEffect(() => {
    updateUrl({
      query: {
        // Coerce empty strings to undefined to cause the query param to be
        // removed from the URL when the search query is cleared.
        [SEARCH_QUERY_PARAM]: searchQuery || undefined
      }
    });
  }, [searchQuery]);


  return (
    <>
      <div className="row">
        <div className="col-12">
          <p className="my-4 py-lg-2">
            Welcome to Signal Stickers, the unofficial directory for Signal sticker
            packs. You can filter packs by title, author, or tags.<br />
            Follow <a href="https://twitter.com/signalstickers" rel="noreferrer" target="_blank" title="Twitter feed">@signalstickers</a> to
            stay tuned for new packs!
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <SearchInput />
        </div>
      </div>
      <StickerPackList />
    </>
  );
};


export default HomeComponent;
