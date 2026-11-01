import * as R from 'ramda';
import React from 'react';
import {Waypoint} from 'react-waypoint';

import LoadingSpinner from 'components/general/LoadingSpinner';
import PackCardLink from 'components/general/PackCardLink';
import StickersContext from 'contexts/StickersContext';


/**
 * How many items we will load each time loadMore() is called.
 */
const PAGE_SIZE = 64;


export default function StickerPackListComponent() {
  const {searchResults, showNsfw, allStickerPacks, searchQuery, sortOrder, isDirectoryComplete} = React.useContext(StickersContext);
  // Used by Waypoint to persist the component across re-renders.
  const [cursor, setCursor] = React.useState(0);
  // Subset of total search results that have been rendered.
  const [renderedSearchResults, setRenderedSearchResults] = React.useState<typeof searchResults>([]);


  /**
   * Adds PAGE_SIZE items from searchResults to renderedSearchResults and
   * updates the cursor.
   */
  const loadMore = React.useCallback(() => {
    // If we have rendered all search results, bail.
    if (renderedSearchResults.length >= searchResults.length) {
      return;
    }

    const newCursor = cursor + PAGE_SIZE;
    setCursor(newCursor);
    setRenderedSearchResults(R.take(newCursor, searchResults));
  }, [
    cursor,
    searchResults,
    renderedSearchResults
  ]);


  /**
   * [Effect] When the list of search results is updated, re-set our rendered
   * search results and cursor.
   */
  React.useLayoutEffect(() => {
    setCursor(0);
    setRenderedSearchResults([]);
    loadMore();
  }, [searchResults]);


  const isDefaultView = searchQuery.length === 0 && sortOrder === '';

  // Spinner while: the packs haven't loaded yet, OR a query/sort is active but the full
  // directory isn't loaded (searching/sorting the 64 isn't meaningful).
  const showSpinner = allStickerPacks === undefined || (!isDefaultView && !isDirectoryComplete);

  if (showSpinner) {
    return (
      <div className="row">
        <div className="col-12 d-flex align-items-center justify-content-center py-5">
          <LoadingSpinner />
        </div>
      </div>
    );
  }


  // ----- Render --------------------------------------------------------------

  return (
    <div className="row">
      {renderedSearchResults.map(result => {
        if (!result.item.meta.nsfw || result.item.meta.nsfw && showNsfw){
          return (
            <div
              key={result.item.meta.id}
              className="col-6 col-md-4 col-lg-3 mb-4"
            >
              <PackCardLink stickerPack={result.item} />
            </div>
          );
        }
        return null;
      })}
      <Waypoint
        key={cursor}
        onEnter={loadMore}
        bottomOffset="-500px"
      />
    </div>
  );
}
