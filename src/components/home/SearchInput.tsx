import debounceFn from 'debounce-fn';
import {cx} from 'linaria';
import {styled} from 'linaria/react';
import React, {useContext, useState, useEffect} from 'react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';
import useBreakpoint from 'use-breakpoint';

import {SIGNAL_BLUE} from 'etc/colors';
import {BOOTSTRAP_BREAKPOINTS} from 'etc/constants';
import StickersContext from 'contexts/StickersContext';


// ----- Styles ----------------------------------------------------------------

const SearchInput = styled.div`
  & .octicon-search {
    color: ${SIGNAL_BLUE};
    font-size: 14px;
    position: relative;
    left: -1px;
  }

  & .input-group-lg {
    & .octicon {
      font-size: 24px;
    }

    & input {
      font-weight: 400;
    }
  }

  & .badge-signal{
    color: ${SIGNAL_BLUE};
    border: 1px solid ${SIGNAL_BLUE};
    margin-right: 5px;
  }
`;

// ----- Component -------------------------------------------------------------

const SearchInputComponent: React.FunctionComponent = () => {
  const {allStickerPacks, searchQuery, setSearchQuery} = useContext(StickersContext);
  const [searchQueryInputValue, setSearchQueryInputValue] = useState('');
  const {breakpoint} = useBreakpoint(BOOTSTRAP_BREAKPOINTS, 'xl');
  const suggestedTags = ['cute', 'privacy', 'meme', 'for children'];


  /**
   * Allows us to de-bounce calls to setSearchQuery to avoid making excessive
   * re-renders when the input value is updated.
   */
  const debouncedSetSearchQuery = debounceFn((value: string) => {
    setSearchQuery(value);
  }, {wait: 250});


  /**
   * [Event Handler] Updates our context's search query state.
   */
  function onSearchQueryInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const {value} = event.target;
    setSearchQueryInputValue(value);
  }

  function onTagClick(event: React.SyntheticEvent) {
    setSearchQueryInputValue(event.currentTarget.textContent);
  }

  const tags = suggestedTags.map(tag =>
    <a href="#" className="badge badge-signal" onClick={onTagClick}>{tag}</a>
  );

  /**
   * [Event Handler] Clears our context's search query state.
   */
  function clearSearchResults(event: React.SyntheticEvent) {
    event.preventDefault();
    setSearchQueryInputValue('');
    setSearchQuery('');
  }


  /**
   * [Effect] When the component mounts, set the search input's value to the
   * current search query from our context.
   */
  useEffect(() => {
    if (searchQuery) {
      setSearchQueryInputValue(searchQuery);
    }
  }, []);


  /**
   * [Effect] When the search query is updated, call our de-bounced update
   * function.
   */
  useEffect(() => {
    debouncedSetSearchQuery.cancel();
    debouncedSetSearchQuery(searchQueryInputValue);

    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [searchQueryInputValue]);


  // ----- Render --------------------------------------------------------------

  const placeholder = allStickerPacks ? `Search ${allStickerPacks.length} sticker packs...` : '';

  return (
    <SearchInput className="form-group mb-4 mb-md-5">
      <div className={cx('input-group', ['md', 'lg', 'xl'].includes(breakpoint) && 'input-group-lg')}>
        <div className="input-group-prepend">
          <span className="input-group-text">
            <Octicon name="search" />
          </span>
        </div>
        <input
          type="text"
          key="search"
          className="form-control"
          onChange={onSearchQueryInputChange}
          value={searchQueryInputValue}
          placeholder={placeholder}
          title="Search"
          aria-label="search"
          autoComplete="false"
          spellCheck="false"
        />
        <div className="input-group-append">
          <button className="input-group-text btn btn-light btn-sm" onClick={clearSearchResults} title="Clear Search Results">
            &nbsp;<Octicon name="x" className="text-danger" />
          </button>
        </div>
      </div>
      <small>Lost? Why not start with these tags?</small> {tags}
    </SearchInput>
  );
};


export default SearchInputComponent;
