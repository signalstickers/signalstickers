import React from 'react';

import SearchInput from './SearchInput';
import StickerPackList from './SearchResults';


const HomeComponent: React.FunctionComponent = () => {
  return (
    <>
      <SearchInput />
      <StickerPackList />
    </>
  );
};


export default HomeComponent;
