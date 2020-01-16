import React from 'react';

import SearchInput from './SearchInput';
import StickerPackList from './SearchResults';


const HomeComponent: React.FunctionComponent = () => {
  return (
    <div className="mt-4 mt-md-5 mb-5">
      <p className="pb-2 pb-md-4">
        Welcome to Signal Stickers, the unofficial directory for Signal sticker
        packs. You can filter packs by title, author, or tags.
      </p>
      <SearchInput />
      <StickerPackList />
    </div>
  );
};


export default HomeComponent;
