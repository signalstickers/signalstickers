import sleep from '@darkobits/sleep';
import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Waypoint} from 'react-waypoint';
import {styled} from 'linaria/react';
import * as R from 'ramda';

import StickerPackPreviewCard from 'components/StickerPackPreviewCard';
import SearchInput from 'components/SearchInput';
import StickerContext from 'contexts/StickersContext';
import {StickerPack} from 'etc/types';


// ----- Styles ----------------------------------------------------------------

const StickerPackList = styled.div`
  & a {
    &:hover {
      text-decoration: none;
    }
  }
`;


// ----- Component -------------------------------------------------------------

/**
 * How many items we will load each time loadMore() is called.
 */
const PAGE_SIZE = 32;


const StickerPackListComponent = () => {
  const {searchResults} = useContext(StickerContext);

  // Used by Waypoint to persist the component across re-renders.
  const [cursor, setCursor] = useState(0);

  // Subset of total search results that have been rendered.
  const [renderedSearchResults, setRenderedSearchResults] = useState<Array<StickerPack>>([]);


  /**
   * Adds PAGE_SIZE items from searchResults to renderedSearchResults and
   * updates the cursor.
   */
  async function loadMore() {
    // If we have rendered all search results, bail.
    if (renderedSearchResults.length >= searchResults.length) {
      return;
    }

    // We need to put a slight delay here to allow React time to re-render with
    // updated search results. Without a delay, our Waypoint will continue to
    // report that it is visible even though we have rendered enough search
    // results to ensure it is off-screen. This delay and PAGE_SIZE can be
    // adjusted to tune the amount of over-shoot when rendering results.
    if (cursor > 0) {
      await sleep(10);
    }

    const newCursor = cursor + PAGE_SIZE;
    setCursor(newCursor);
    setRenderedSearchResults(R.take(newCursor, searchResults));
  }


  /**
   * Called when our Waypoint is rendered and is on-screen.
   */
  function onEnter() {
    loadMore(); // tslint:disable-line no-floating-promises
  }


  /**
   * [Effect] When the list of search results is updated, re-set our rendered
   * search results and cursor.
   */
  useEffect(() => {
    async function resetRenderedResultsEffect() {
      setCursor(0);
      setRenderedSearchResults([]);
      await loadMore();
    }

    resetRenderedResultsEffect(); // tslint:disable-line no-floating-promises
  }, [searchResults]);


  // ----- Render --------------------------------------------------------------

  return (
    <>
      <SearchInput />
      <StickerPackList className="row">
        {renderedSearchResults.map(({meta, manifest}) => {
          return (
            <Link className="col-6 col-md-4 col-lg-3 mb-4" key={meta.id} to={`/pack/${meta.id}`}>
              <StickerPackPreviewCard stickerPack={{meta, manifest}} />
            </Link>
          );
        })}
        <Waypoint key={cursor} onEnter={onEnter} />
      </StickerPackList>
    </>
  );
};


export default StickerPackListComponent;
