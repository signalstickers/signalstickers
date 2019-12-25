import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {styled} from 'linaria/react';

import StickerPackPreviewCard from 'components/StickerPackPreviewCard';
import SearchInput from 'components/SearchInput';
import StickerContext from 'contexts/StickersContext';


// ----- Styles ----------------------------------------------------------------

const StickerPackList = styled.div`
  padding-top: 24px;
  margin-bottom: 24px;

  & .search-results {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  & a {
    max-width: calc(50% - 12px);
    width: calc(50% - 12px);
  }

  & a:not(:last-child) {
    display: block;
    margin-bottom: 24px;
  }
`;


// ----- Component -------------------------------------------------------------

const StickerPackListComponent = () => {
  const {searchResults} = useContext(StickerContext);

  return (
    <StickerPackList>
      <SearchInput />

      <div className="search-results">
        {searchResults.map(stickerPack => (
          <Link key={stickerPack.id} to={`/pack/${stickerPack.id}`}>
            <StickerPackPreviewCard stickerPack={stickerPack} />
          </Link>
        ))}
      </div>
    </StickerPackList>
  );
};


export default StickerPackListComponent;
