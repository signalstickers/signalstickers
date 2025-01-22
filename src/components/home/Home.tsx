import React from 'react';

import ExternalLink from 'components/general/ExternalLink';
import Context from 'contexts/StickersContext';
import { SEARCH_QUERY_PARAM } from 'etc/constants';
import useQuery from 'hooks/use-query';
import useUpdateUrl from 'hooks/use-update-url';

import SearchInput from './SearchInput';
import StickerPackList from './SearchResults';


export default function Home() {
  const {searchQuery, setSearchQuery} = React.useContext(Context);
  const query = useQuery();
  const updateUrl = useUpdateUrl();


  /**
   * Perform a one-time URL-to-state sync when the component mounts.
   */
  React.useEffect(() => {
    const searchQueryFromUrl = query[SEARCH_QUERY_PARAM] ?? null;

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
        // Coerce empty strings to null to cause the query param to be
        // removed from the URL when the search query is cleared.
        [SEARCH_QUERY_PARAM]: searchQuery
      }
    });
  }, [searchQuery]);


  const stickerPackLink = React.useMemo(() => (
    <ExternalLink
      href="https://support.signal.org/hc/en-us/articles/360031836512-Stickers"
      title="Stickers - Signal Support"
    >
      sticker packs
    </ExternalLink>
  ), []);


  return (
    <>
      <div className="row">
        <div className="col-12 mt-4 mb-1 mb-md-3 pt-lg-2">
          <p className="intro">
            Welcome to Signal Stickers, the unofficial directory for Signal {stickerPackLink}.
            You can filter packs by title, author, or tags.
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
}
