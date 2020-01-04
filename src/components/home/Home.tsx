import React from 'react';

import SearchInput from './SearchInput';
import StickerPackList from './SearchResults';


const HomeComponent: React.FunctionComponent = () => {
  return (
    <div className="mt-4 mt-md-5 mb-5">
      <p>
        Welcome to Signal Stickers, the unofficial directory for Signal sticker
        packs. You can filter packs by title, author, or tags.
      </p>
      <p className="mb-4 mb-md-5">
        To get your sticker pack listed in the directory, click the Contribute
        button above.
      </p>
      <SearchInput />
      <StickerPackList />
    </div>
  );
};


export default HomeComponent;
