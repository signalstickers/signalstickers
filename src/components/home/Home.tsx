import {styled} from 'linaria/react';
import React from 'react';

import Context from 'contexts/StickersContext';
import useQuery from 'hooks/use-query';
import useUpdateUrl from 'hooks/use-update-url';

import ExternalLink from 'components/general/ExternalLink';
import {SEARCH_QUERY_PARAM} from 'etc/constants';
import {bp} from 'lib/utils';

import SearchInput from './SearchInput';
import StickerPackList from './SearchResults';


// ----- Styles ----------------------------------------------------------------

const StyledHome = styled.div`
  @media ${bp('sm', 'max')} {
    & .intro {
      font-size: 14px;
    }
  }
`;


// ----- Home ------------------------------------------------------------------

const HomeComponent: React.FunctionComponent = () => {
  const {searchQuery, setSearchQuery} = React.useContext(Context);
  const query = useQuery();
  const updateUrl = useUpdateUrl();


  /**
   * Perform a one-time URL-to-state sync when the component mounts.
   */
  React.useEffect(() => {
    const searchQueryFromUrl = query[SEARCH_QUERY_PARAM] ? query[SEARCH_QUERY_PARAM] : null;

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
        [SEARCH_QUERY_PARAM]: searchQuery || null
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


  const twitterLink = React.useMemo(() => (
    <ExternalLink
      href="https://twitter.com/signalstickers"
      title="Twitter"
    >
      @signalstickers
    </ExternalLink>
  ), []);


  return (
    <StyledHome>
      <div className="row">
        <div className="col-12 mt-4 mb-1 mb-md-3 pt-lg-2">
          <p className="intro">
            Welcome to Signal Stickers, the unofficial directory for Signal {stickerPackLink}.
            You can filter packs by title, author, or tags. Follow {twitterLink} on Twitter to stay
            tuned for new packs!
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <SearchInput />
        </div>
      </div>
      <StickerPackList />
    </StyledHome>
  );
};


export default HomeComponent;
