import React from 'react';

import SearchInput from './SearchInput';
import StickerPackList from './SearchResults';


const HomeComponent: React.FunctionComponent = () => {
  return (
    <>
      <div className="row">
        <div className="col-12">
          <p className="my-4 py-lg-2">
            Welcome to Signal Stickers, the unofficial directory for Signal sticker
            packs. You can filter packs by title, author, or tags.<br/>
            Follow <a href="https://twitter.com/signalstickers" rel="noreferrer" target="_blank" title="Twitter feed">@signalstickers</a> to
            stay tuned for new packs!
            </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <SearchInput />
        </div>
      </div>
      <StickerPackList />
    </>
  );
};


export default HomeComponent;
