import React, {useContext} from 'react';
import {styled} from 'linaria/react';
import {darken} from 'polished';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import {GRAY} from 'etc/colors';
import Button from 'components/Button';
import StickersContext from 'contexts/StickersContext';


// ----- Styles ----------------------------------------------------------------

const SearchInput = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 24px;
  width: 100%;

  & input {
    border: 1px solid ${darken(0.15, GRAY)};
    border-radius: 4px;
    flex-grow: 1;
    font-size: 18px;
    margin-right: 12px;
    padding: 4px 8px;
    transition: border-color 0.25s ease-in-out;
  }

  & input:focus {
    outline: none;
    border-color: ${darken(0.4, GRAY)};
  }

  & .octicon-x {
    color: red;
  }
`;


// ----- Component -------------------------------------------------------------

const SearchInputComponent: React.FunctionComponent = () => {
  const {searchQuery, setSearchQuery} = useContext(StickersContext);


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
  function clearSearchResults() {
    setSearchQuery('');
  }


  // ----- Render --------------------------------------------------------------

  return (
    <SearchInput>
      <Octicon name="search" />&nbsp;&nbsp;
      <input name="search" value={searchQuery} onChange={onSearchQueryChange} placeholder="Search" title="Search" />
      <Button variant="secondary" onClick={clearSearchResults} title="Clear Search Results">
        &nbsp;<Octicon name="x" />
      </Button>
    </SearchInput>
  );
};


export default SearchInputComponent;
