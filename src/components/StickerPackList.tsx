import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import {styled} from 'linaria/react';

import StickerPackPreviewCard from 'components/StickerPackPreviewCard';
import SearchInput from 'components/SearchInput';
import StickerContext from 'contexts/StickersContext';


// ----- Styles ----------------------------------------------------------------

const StickerPackList = styled.div`
  & a {
    &:hover {
      text-decoration: none;
    }
  }
`;


// ----- Component -------------------------------------------------------------

const StickerPackListComponent = () => {
  const {searchResults} = useContext(StickerContext);

  return (
    <>
      <SearchInput />
      <StickerPackList className="row">
        {searchResults.map(stickerPack => (
          <Link className="col-6 col-sm-6 col-md-4 col-lg-3 mb-4" key={stickerPack.id} to={`/pack/${stickerPack.id}`}>
            <StickerPackPreviewCard stickerPack={stickerPack} />
          </Link>
        ))}
      </StickerPackList>
    </>
  );
};


export default StickerPackListComponent;
