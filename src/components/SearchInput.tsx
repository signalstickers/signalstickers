import React, {useContext} from 'react';
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


  /**
   * [Event Handler] Updates our context's search query state.
   */
  function onSearchQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const {value} = event.target;
    event.preventDefault();
    setSearchQuery(value);
  }

  /**
   * [Event Handler] Clears our context's search query state.
   */
  function clearSearchResults(event: React.SyntheticEvent) {
    event.preventDefault();
    setSearchQuery('');
  }


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
            <input type="text" className="form-control" value={searchQuery} onChange={onSearchQueryChange} placeholder={placeholder} title="Search" />
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
