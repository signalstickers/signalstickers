import React, {useContext, useState, useEffect} from 'react';
import debounceFn from 'debounce-fn';
import {styled} from 'linaria/react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import {SIGNAL_BLUE} from 'etc/colors';

import StickersContext from 'contexts/StickersContext';


// ----- Styles ----------------------------------------------------------------

const SearchInput = styled.form`
  & .octicon-search {
    color: ${SIGNAL_BLUE};
    font-size: 24px;
    position: relative;
    left: -1px;
  }

  & .octicon-x {
    font-size: 24px;
  }
`;


// ----- Component -------------------------------------------------------------

const SearchInputComponent: React.FunctionComponent = () => {
  const {allStickerPacks, searchQuery, setSearchQuery} = useContext(StickersContext);
  const [searchQueryInputValue, setSearchQueryInputValue] = useState('');


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
  function onSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const {value} = event.target;
    event.preventDefault();
    setSearchQueryInputValue(value);
  }

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
   * [Effect] When the search query is updated, call our debounced update
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
    <SearchInput className="row mb-5 mt-5">
      <div className="col-12">
        <div className="form-group m-0">
          <div className="input-group input-group-lg">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <Octicon name="search" />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              value={searchQueryInputValue}
              onChange={onSearchQueryChange}
              placeholder={placeholder}
              title="Search"
            />
            <div className="input-group-append">
              <button className="input-group-text btn btn-light btn-sm" onClick={clearSearchResults} title="Clear Search Results">
                &nbsp;<Octicon name="x" className="text-danger" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </SearchInput>
  );
};


export default SearchInputComponent;
