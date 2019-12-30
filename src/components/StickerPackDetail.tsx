import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import Linkify from 'react-linkify';
import {styled} from 'linaria/react';
import {darken} from 'polished';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import {GRAY, SIGNAL_BLUE} from 'etc/colors';
import StickersContext from 'contexts/StickersContext';
import Sticker from 'components/Sticker';
import {capitalizeFirst} from 'lib/utils';


// ----- Styles ----------------------------------------------------------------

const StickerPackDetail = styled.div`
  border-radius: 4px;
  border: 1px solid ${darken(0.15, GRAY)};

  & .list-group-item {
    align-items: center;
    display: flex;
    flex-direction: row;

    & .octicon {
      font-size: 20px;
      margin-right: 20px;
    }
  }

  & .octicon-globe {
    color: ${SIGNAL_BLUE};
  }

  & .octicon-file-directory {
    color: ${SIGNAL_BLUE};
  }

  & .octicon-alert {
    color: ${SIGNAL_BLUE};
  }

  & .octicon-tag {
    color: ${SIGNAL_BLUE};
  }

  & .title {
    font-size: 42px;
    font-weight: 600;
  }

  & .author {
    font-size: 16px;
    font-weight: 400;
    opacity: 0.6;
  }

  & strong {
    font-weight: 600;
  }

  & .tag {
    background-color: ${darken(0, SIGNAL_BLUE)};
    border-radius: 4px;
    border: 1px solid ${darken(0.1, 'white')};
    color: white;
    display: inline-block;
    font-size: 12px;
    font-weight: 400;
    line-height: 1em;
    padding: 5px 7px;
    text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.4);
    margin-right: 3px;
    margin-left: 3px;
    position: relative;
    top: -1px;
  }
`;


// ----- Component -------------------------------------------------------------

const StickerPackDetailComponent: React.FunctionComponent = () => {
  const {currentStickerPack} = useContext(StickersContext);


  /**
   * Accepts a "tags" property from a sticker pack's metadata and returns an
   * array of capitalized tags. If the string is empty, returns 'N/A'.
   */
  function parseStickerPackTags(tags: string) {
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length)
      .map(tag => tag.split(' ').map(capitalizeFirst).join(' '));

    if (tagsArray.length) {
      return tagsArray;
    }

    return 'None';
  }


  /**
   * [Event Handler] Click handler for the Add to Signal button. Opens a new tab
   * allowing the user to add the sticker pack to the Signal app.
   */
  function handleAddToSignal() {
    if (!currentStickerPack) {
      return;
    }

    window.open(`sgnl://addstickers/?pack_id=${currentStickerPack.id}&pack_key=${currentStickerPack.key}`, '_blank');
  }


  // ----- Render --------------------------------------------------------------

  if (!currentStickerPack) {
    return null; // tslint:disable-line no-null-keyword
  }

  const source = currentStickerPack.source || 'N/A';
  const numStickers = currentStickerPack.stickers.length;
  // N.B. Signal allows strings containing only whitespace as authors. In these
  // cases, use 'Anonymous' instead.
  const author = currentStickerPack.author.trim() ? currentStickerPack.author : 'Anonymous';
  const stickerPackTags = parseStickerPackTags(currentStickerPack.tags);

  return (
    <StickerPackDetail className="p-4 my-5">
      <div className="row mb-4 flex-column-reverse flex-lg-row">
        <div className="col-12 col-lg-8 mt-4 mt-lg-0">
          <div className="title">{currentStickerPack.title}</div>
          <div className="author">{author}</div>
        </div>
        <div className="col-12 col-lg-4 d-flex d-lg-block justify-content-between text-md-right">
          <Link to="/">
            <button type="button" className="btn btn-link mr-2">
              Back
            </button>
          </Link>
          <button className="btn btn-primary" onClick={handleAddToSignal}>
            <Octicon name="plus" />&nbsp;Add to Signal
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-lg-8">
          <ul className="list-group">
            <li className="list-group-item">
              <Octicon name="globe" title="Source" />
              <div>
                <Linkify>{source}</Linkify>
              </div>
            </li>
            <li className="list-group-item">
              <Octicon name="file-directory" title="Sticker Count" />
              {numStickers}
            </li>
            <li className="list-group-item">
              <Octicon name="alert" title="NSFW" /> <strong>NSFW:</strong>&nbsp;{currentStickerPack.nsfw ? 'Yes' : 'No'}
            </li>
            <li className="list-group-item">
              <Octicon name="tag" title="Tags" />
              <div>
                {Array.isArray(stickerPackTags) ? stickerPackTags.map(tag => (<span key={tag} className="tag">{tag}</span>)) : stickerPackTags}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div className="col-12 p-2 p-sm-3">
          <div className="d-flex flex-wrap">
            {currentStickerPack.stickers.map((sticker, index) => (<Sticker packId={currentStickerPack.id} stickerId={sticker.id} key={sticker.id} />))}
          </div>
        </div>
      </div>
    </StickerPackDetail>
  );
};


export default StickerPackDetailComponent;
