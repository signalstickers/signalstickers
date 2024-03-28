import cx from 'classnames';
import debounceFn from 'debounce-fn';
import pluralize from 'pluralize';
import React from 'react';
import { BsSearch, BsXLg } from 'react-icons/bs';

import Tag from 'components/general/Tag';
import AppStateContext from 'contexts/AppStateContext';
import StickersContext from 'contexts/StickersContext';

import classes from './SearchInput.css';

import type { SortOrder } from 'etc/types';


export default function SearchInputComponent() {
  const {
    searcher,
    searchQuery,
    searchResults,
    setSearchQuery
  } = React.useContext(StickersContext);
  const { useAppState } = React.useContext(AppStateContext);
  const [searchQueryInputValue, setSearchQueryInputValue] = React.useState('');
  const suggestedTags = ['cute', 'privacy', 'meme', 'for children'];
  const [showNsfw, setShowNsfw] = useAppState<boolean>('showNsfw');
  const [sortOrder, setSortOrder] = useAppState<SortOrder>('sortOrder');


  /**
   * Allows us to de-bounce calls to setSearchQuery to avoid making excessive
   * re-renders when the input value is updated.
   */
  const debouncedSetSearchQuery = debounceFn(setSearchQuery, { wait: 250 });


  /**
   * [Effect] Context state -> local/input state.
   */
  React.useEffect(() => {
    if (searchQuery) setSearchQueryInputValue(searchQuery);
  }, [searchQuery]);


  /**
   * [Effect] Local state -> context state (debounced).
   */
  React.useEffect(() => {
    debouncedSetSearchQuery.cancel();
    debouncedSetSearchQuery(searchQueryInputValue);
    return () => debouncedSetSearchQuery.cancel();
  }, [
    debouncedSetSearchQuery,
    searchQueryInputValue
  ]);


  /**
   * [Event Handler] Sets an appropriate search query when non-tag suggestion
   * types are selected.
   */
  const onSuggestionClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!searcher || !event.currentTarget.textContent) return;

    switch (event.currentTarget.dataset.suggestionType) {
      case 'animated':
        setSearchQuery(searcher.buildQueryString({
          expression: { $and: [{ animated: 'true' }] }
        }));
        break;
      case 'editorschoice':
        setSearchQuery(searcher.buildQueryString({
          expression: { $and: [{ editorschoice: 'true' }] }
        }));
        break;
    }
  }, [
    searcher,
    setSearchQuery
  ]);


  /**
   * [Event Handler] Clears our context's search query state.
   */
  const clearSearchResults = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();
    setSearchQueryInputValue('');
    setSearchQuery('');
  }, [
    setSearchQueryInputValue,
    setSearchQuery
  ]);


  /**
   * [Effect] When the component mounts, set the search input's value to the
   * current search query from our context.
   */
  React.useEffect(() => {
    if (searchQuery) {
      setSearchQueryInputValue(searchQuery);
    }
  }, [searchQuery]);


  /**
   * [Effect] When the search query is updated, call our debounced update
   * function.
   */
  React.useEffect(() => {
    debouncedSetSearchQuery.cancel();
    debouncedSetSearchQuery(searchQueryInputValue);
    return () => debouncedSetSearchQuery.cancel();
  }, [
    debouncedSetSearchQuery,
    searchQueryInputValue
  ]);


  /**
   * [Memo] Suggested categories and tags.
   */
  const tagsFragment = React.useMemo(() => {
    return (
      <>
        <button
          type="button"
          className="btn btn-outline-secondary px-2 py-0 text-nowrap shadow-sm fs-7"
          onClick={onSuggestionClick}
          data-suggestion-type="editorschoice"
        >
          Editor's Choice
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary px-2 text-nowrap shadow-sm py-0 fs-7"
          onClick={onSuggestionClick}
          data-suggestion-type="animated"
        >
          Animated
        </button>
        {suggestedTags.map(tag => <Tag key={tag} label={tag} className="shadow-sm" />)}
      </>
    );
  }, [suggestedTags]);


  return (
    <div className="position-relative mb-4">
      <div className="mb-2 position-relative rounded-3 shadow-sm">
        <div className="position-absolute top-0 start-0 d-flex align-items-center ps-3 h-100 pe-none">
          <BsSearch className="text-body-secondary" />
        </div>
        <input
          type="text"
          key="search"
          className="form-control form-control-lg fs-4 pe-5 bg-transparent"
          style={{ paddingLeft: '40px' }}
          value={searchQueryInputValue}
          title="Search"
          aria-label="search"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          enterKeyHint="search"
          onChange={e => setSearchQueryInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && e.currentTarget.blur()}
        />

        {/* Search Clear Button */}
        <button
          type="button"
          title="Clear Search Results"
          className={cx(
            'btn btn-link position-absolute top-0 end-0 text-reset',
            'd-flex align-items-center h-100 px-3 fs-4'
          )}
          onClick={clearSearchResults}
          style={{ opacity: searchQueryInputValue ? 1 : 0 }}
        >
          <BsXLg className={classes.searchClearIcon} />
        </button>
      </div>
      <div className="d-flex align-items-start justify-content-between gap-2 mb-4 mb-md-5">
        {/* Suggested Tags */}
        <div className="d-flex align-items-center align-self-start flex-wrap gap-2">
          {tagsFragment}
        </div>

        {/* Search Result Count */}
        <div className="text-muted text-nowrap fs-6 align-self-start">
          {(searchResults?.length || 0).toLocaleString()} {pluralize('result', searchResults.length ?? 0)}
        </div>
      </div>
      <div className="d-flex">
        {/* Sort Dropdown */}
        <div className="me-4">
          <span className="fs-6">
            Sort by
          </span>
          <select
            className="d-inline-block form-control form-select w-auto ps-2 py-1 ms-2"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as SortOrder)}
          >
            <option value="latest">Latest</option>
            <option value="trending">Trending</option>
            <option value="mostViewed">Most Viewed</option>
            <option value="relevance" disabled={!searchQuery}>Relevance</option>
          </select>
        </div>

        {/* Show NSFW Switch */}
        <div className="form-check form-switch d-flex align-items-center my-0 px-0">
          <label
            className="form-check-label fs-6 me-2"
            htmlFor="toggleNsfw"
          >Show NSFW</label>
          <input
            className="form-check-input fs-2 my-0 mx-0"
            type="checkbox"
            role="switch"
            id="toggleNsfw"
            onChange={e => setShowNsfw(e.target.checked)}
            checked={showNsfw}
          />
        </div>
      </div>
    </div>
  );
}
