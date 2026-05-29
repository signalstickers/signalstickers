import cx from 'classnames';
import debounceFn from 'debounce-fn';
import React from 'react';
import { BsSearch, BsX } from 'react-icons/bs';
import { FaInfoCircle } from 'react-icons/fa';
import { HashLink } from 'react-router-hash-link';

import StickersContext from 'contexts/StickersContext';
import { SPARKLE_GOLD } from 'etc/colors';
import { generateSparkles } from 'lib/sparkles';

import classes from './SearchInput.css';
import ToggleSwitch from './ToggleSwitch';


export default function SearchInputComponent() {
  const { searcher, searchQuery, searchResults, setSearchQuery, sortOrder, setSortOrder, setShowNsfw, hasEditorsChoiceFilter } = React.useContext(StickersContext);
  const [searchQueryInputValue, setSearchQueryInputValue] = React.useState('');
  const searchHelpRef = React.useRef<HTMLDivElement>(null);
  const suggestedTags = ['cute', 'privacy', 'meme', 'for children'];


  /**
   * Allows us to de-bounce calls to setSearchQuery to avoid making excessive
   * re-renders when the input value is updated.
   */
  const debouncedSetSearchQuery = debounceFn(setSearchQuery, { wait: 250 });


  /**
   * [Effect] Context state -> local/input state.
   */
  React.useEffect(() => {
    setSearchQueryInputValue(searchQuery);
  }, [searchQuery]);


  /**
   * [Event Handler] Input state -> local state.
   */
  const onSearchQueryInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQueryInputValue(value);
  }, [
    setSearchQueryInputValue
  ]);

  /**
   * [Event Handler] Input order state -> local state.
   */
  const onSortOrderChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setSortOrder(value);
  }, [
    setSortOrder
  ]);


  /**
   * [Effect] Local state -> context state (debounced).
   */
  React.useEffect(() => {
    debouncedSetSearchQuery.cancel();
    debouncedSetSearchQuery(searchQueryInputValue);

    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [
    debouncedSetSearchQuery,
    searchQueryInputValue
  ]);


  /**
   * [Event Handler] Sets the search query when a tag or the 'animated'
   * suggestion is clicked.
   */
  const onSuggestionClick = React.useCallback((event: React.SyntheticEvent<HTMLButtonElement>) => {
    if (searcher && event.currentTarget.textContent) {
      switch (event.currentTarget.dataset.suggestionType) {
        case 'tag':
          setSearchQuery(searcher.buildQueryString({
            attributeQueries: [{
              tag: event.currentTarget.textContent
            }]
          }));
          break;

        case 'animated':
          setSearchQuery(searcher.buildQueryString({
            attributeQueries: [{
              animated: 'true'
            }]
          }));
          break;

        case 'editorschoice':
          setSearchQuery(searcher.buildQueryString({
            attributeQueries: [{
              editorschoice: 'true'
            }]
          }));
          break;
      }
    }
  }, [
    searcher,
    setSearchQuery
  ]);


  /**
   * [Event Handler] Show the search help icon when the input element is
   * focused.
   */
  const handleInputFocus = React.useCallback(() => {
    if (!searchHelpRef.current) {
      return;
    }

    searchHelpRef.current.style.opacity = '1';
    searchHelpRef.current.style.pointerEvents = 'initial';
  }, [
    searchHelpRef
  ]);


  /**
   * [Event Handler] Hide the search help icon when the input element is
   * blurred. We also disable pointer events to prevent clicking on the element
   * when it is not visible.
   */
  const handleInputBlur = React.useCallback(() => {
    if (!searchHelpRef.current) {
      return;
    }

    searchHelpRef.current.style.opacity = '0';

    // Allows a click on the search help icon to proceed before disabling
    // pointer events.
    setTimeout(() => {
      if (!searchHelpRef.current) {
        return;
      }

      searchHelpRef.current.style.pointerEvents = 'none';
    }, 250);
  }, [
    searchHelpRef
  ]);


  /**
   * [Event Handler] Clears our context's search query state.
   */
  const clearSearchResults = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();
    setSearchQuery('');
  }, [
    setSearchQuery
  ]);

  /**
   * [Event Handler] Change either to show NSFW
   */
  const onNsfwToggle = (state: boolean) => {
    setShowNsfw(state);
  };


  const searchSparkles = React.useMemo(() => {
    if (!hasEditorsChoiceFilter) {
      return [];
    }
    return generateSparkles('searchbar-editorschoice-sparkles-6e7a24f542', 15);
  }, [hasEditorsChoiceFilter]);

  /**
   * [Memo] JSX fragment containing the set of suggested tags.
   */
  const tagsFragment = React.useMemo(() => suggestedTags.map(tag => (
    <button
      type="button"
      key={tag}
      className={cx(classes.miniTag, 'btn', 'mr-1')}
      onClick={onSuggestionClick}
      data-suggestion-type="tag"
    >
      {tag}
    </button>
  )), [suggestedTags]);


  // ----- Render --------------------------------------------------------------

  return (
    <div className={cx(classes.searchInputWrapper, 'form-group', 'mb-4')}>
      <div className={cx('mb-1', 'position-relative', classes.searchInputField)}>
        {searchSparkles.map((s, i) => (
          <span
            key={i}
            className={classes.sparkle}
            aria-hidden="true"
            style={{
              top: s.top,
              left: s.left,
              fontSize: s.fontSize,
              color: `rgba(${SPARKLE_GOLD}, ${s.opacity})`,
              animationDuration: s.duration,
              animationDelay: s.delay
            }}
          >
            ✦
          </span>
        ))}
        <div className={classes.searchPrepend}>
          <BsSearch />
        </div>
        <input
          type="text"
          key="search"
          className={cx(classes.searchInput, 'form-control', 'form-control-lg')}
          onBlur={handleInputBlur}
          onChange={onSearchQueryInputChange}
          onFocus={handleInputFocus}
          value={searchQueryInputValue}
          title="Search"
          aria-label="search"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />
        <div className={classes.searchHelp} ref={searchHelpRef}>
          <HashLink to="/about#searching" title="Search Help" className={classes.searchHelpLink}>
            <FaInfoCircle className={cx(classes.searchHelpIcon, 'text-muted')} />
          </HashLink>
        </div>
        <div className={classes.searchClear}>
          <button
            type="button"
            className={cx(classes.searchClearButton, 'btn', 'btn-link', 'border-0')}
            title="Clear Search Results"
            onClick={clearSearchResults}
          >
            <BsX className={classes.searchClearIcon} />
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <small>
            Suggested: {' '}
          </small>
          <br className="d-inline d-md-none" />
          <button
            type="button"
            className={cx(
              classes.miniTagAnimated,
              'btn',
              'mr-1'
            )}
            onClick={onSuggestionClick}
            data-suggestion-type="animated"
          >
            Animated
          </button>
          <button
            type="button"
            className={cx(classes.miniTagEditorsChoice, 'btn', 'mr-1')}
            onClick={onSuggestionClick}
            data-suggestion-type="editorschoice"
          >
            Editor's choice
          </button>
          {tagsFragment}
        </div>
        <div className="text-muted">
          <small>
            {searchResults?.length || 0} {searchResults.length === 1 ? 'result' : 'results'}
          </small>
        </div>
      </div>
      <div className="mt-5 d-flex flex-wrap">
        <div className="mr-3">
          Sort by
          <select className="d-inline-block form-control form-control-sm w-auto ml-2" value={searchQuery ? 'relevance' : sortOrder} onChange={onSortOrderChange} disabled={searchQuery !== ''}>
            <option value="">Latest</option>
            <option value="trending">Trending</option>
            <option value="mostViewed">Most viewed (all times)</option>
            {searchQuery &&
              /* Only used as a placeholder when a searchQuery is set */
              <option value="relevance">Relevance</option>
            }

          </select>
        </div>
        <div>
          <label className={classes.searchInputLabel} htmlFor="nsfwToggle">
            Show NSFW <ToggleSwitch id="nsfwToggle" onToggle={onNsfwToggle} />
          </label>
        </div>
      </div>
    </div>
  );
}
