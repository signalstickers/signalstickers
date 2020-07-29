import debounceFn from 'debounce-fn';
import {cx} from 'linaria';
import {styled} from 'linaria/react';
import React from 'react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';
import {HashLink} from 'react-router-hash-link';
import useBreakpoint from 'use-breakpoint';

import {SIGNAL_BLUE} from 'etc/colors';
import {BOOTSTRAP_BREAKPOINTS} from 'etc/constants';
import StickersContext from 'contexts/StickersContext';
import {bp} from 'lib/utils';


// ----- Styles ----------------------------------------------------------------

const SearchInput = styled.div`
  & .octicon-search {
    color: ${SIGNAL_BLUE};
    font-size: 14px;
    position: relative;
    left: -1px;
    font-size: 24px;
  }

  & .input-group-lg {
    & .octicon-search,
    & .octicon-x {
      font-size: 24px;
    }

    & input {
      font-weight: 400;
    }
  }

  & .badge-signal {
    color: ${SIGNAL_BLUE};
    border: 1px solid ${SIGNAL_BLUE};
    margin-right: 5px;
  }

  & input::placeholder {
    opacity: 0.8;
  }

  & input:focus::placeholder {
    opacity: 0.5;
  }
`;

const SearchHelp = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 54px;
  top: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 3;

  & a {
    opacity: 0.6;
    transition: opacity 0.15s ease-in-out;

    &:hover {
      opacity: 1;
    }
  }

  & .octicon {
    font-size: 18px;
  }

  @media ${bp('md')} {
    right: 76px;
  }
`;


// ----- Component -------------------------------------------------------------

const SearchInputComponent: React.FunctionComponent = () => {
  const {allStickerPacks, searcher, searchQuery, setSearchQuery} = React.useContext(StickersContext);
  const [searchQueryInputValue, setSearchQueryInputValue] = React.useState('');
  const searchHelpRef = React.useRef<HTMLDivElement>(null);
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
  const onSearchQueryInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setSearchQueryInputValue(value);
  }, [
    setSearchQueryInputValue
  ]);


  /**
   * [Event Handler] Sets the search query when a tag is clicked.
   */
  const onTagClick = React.useCallback((event: React.SyntheticEvent) => {
    if (searcher && event.currentTarget.textContent) {
      setSearchQuery(searcher.buildQueryString({
        attributeQueries: [{
          tag: event.currentTarget.textContent
        }]
      }));
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
  }, [searchHelpRef]);


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
    }, 100);
  }, [searchHelpRef]);


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
   * [Effect] When the search query is updated, call our de-bounced update
   * function.
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
   * [Memo] JSX fragment containing the set of suggested tags.
   */
  const tagsFragment = React.useMemo(() => suggestedTags.map(tag => (
    <button
      type="button"
      key={tag}
      className="badge badge-signal"
      onClick={onTagClick}
    >
      {tag}
    </button>
  )), [suggestedTags]);


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
          onBlur={handleInputBlur}
          onChange={onSearchQueryInputChange}
          onFocus={handleInputFocus}
          value={searchQueryInputValue}
          placeholder={placeholder}
          title="Search"
          aria-label="search"
          autoComplete="false"
          spellCheck="false"
        />
        <div className="input-group-append">
          <button
            type="button"
            className="input-group-text btn btn-light btn-sm"
            onClick={clearSearchResults}
            title="Clear Search Results"
          >
            &nbsp;<Octicon name="x" className="text-danger" />
          </button>
        </div>
        <SearchHelp ref={searchHelpRef}>
          <HashLink to="/about#searching" title="Search Help">
            <Octicon name="info" className="text-muted" />
          </HashLink>
        </SearchHelp>
      </div>
      <small>Lost? Why not start with these tags?</small> {tagsFragment}
    </SearchInput>
  );
};


export default SearchInputComponent;
