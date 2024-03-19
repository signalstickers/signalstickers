import * as R from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';

import StickersContext from 'contexts/StickersContext';

import classes from './SearchResults.css';
import StickerPackPreviewCard from './StickerPackPreviewCard';


/**
 * How many items we will load each time loadMore() is called.
 */
const PAGE_SIZE = 64;


export default function StickerPackListComponent() {
  const {searchResults, showNsfw} = React.useContext(StickersContext);
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
    if (renderedSearchResults.length >= searchResults.length) return;

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


  return (
    <div className="d-flex flex-column flex-grow-1 mb-4">
      <div className="row flex-grow-1">
        <div className="col-12">
          <div className={classes.stickerGridView}>
            {renderedSearchResults.map(stickerPackPartial => {
              return (
                <Link
                  key={stickerPackPartial.meta.id}
                  to={`/pack/${stickerPackPartial.meta.id}`}
                >
                  <StickerPackPreviewCard stickerPack={stickerPackPartial} />
                </Link>
              );
            })}
          </div>
        </div>
        <Waypoint
          key={cursor}
          onEnter={loadMore}
          bottomOffset="-500px"
        />
      </div>
    </div>
  );
}
