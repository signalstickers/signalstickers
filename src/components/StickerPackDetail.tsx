import React, {useContext, useState, useEffect} from 'react';
import Linkify from 'react-linkify';
import {styled} from 'linaria/react';
import {darken} from 'polished';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import {GRAY} from 'etc/colors';
import Button from 'components/Button';
import StickersContext from 'contexts/StickersContext';
import {getStickerInPack} from 'lib/stickers';


// ----- Styles ----------------------------------------------------------------

const StickerPackDetail = styled.div`
  border-radius: 4px;
  border: 1px solid ${darken(0.15, GRAY)};
  margin-bottom: 24px;
  margin-top: 24px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  & .properties {
    display: inline-flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: flex-start;
    margin-bottom: 24px;
  }

  & .upper {
    display: flex;
    flex-direction: row;
    margin-bottom: 12px;
  }

  & .titleWrapper {
    flex-grow: 1;
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

  & .controls {
    min-width: 128px;
    text-align: right;
  }

  & ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  & li {
    line-height: 2em;
    font-size: 14px;
  }

  & strong {
    font-weight: 600;
  }

  & .tag {
    background-color: ${darken(0.2, GRAY)};
    border-radius: 4px;
    border: 1px solid ${darken(0.35, GRAY)};
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

  & .stickers {
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex-basis: 12;
    justify-content: center;
  }

  & .sticker {
    width: 128px;
    height: 128px;
    margin: 12px;
  }
`;


// ----- Component -------------------------------------------------------------

const StickerPackDetailComponent: React.FunctionComponent = () => {
  const {currentStickerPack} = useContext(StickersContext);
  const [stickers, setStickers] = useState<Array<string>>([]);


  /**
   * Accepts a "tags" property from a sticker pack's metadata and returns an
   * array of capitalized tags. If the string is empty, returns 'N/A'.
   */
  function parseStickerPackTags(tags: string) {
    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length)
      .map(tag => tag.substr(0, 1).toUpperCase() + tag.substr(1));

    if (tagsArray.length) {
      return tagsArray;
    }

    return 'N/A';
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


  /**
   * [Effect] This effect will fetch image data for all stickers in our sticker
   * pack and store them in its internal state.
   */
  useEffect(() => {
    async function getAllStickersInPackEffect() {
      if (!currentStickerPack) {
        return;
      }

      const stickerData = await Promise.all(currentStickerPack.stickers.map(async sticker => {
        try {
          return await getStickerInPack(currentStickerPack.id, sticker.id);
        } catch (err) {
          console.error(`[StickerPackDetail] Failed to get sticker ${sticker.id}: ${err.message}`);
          return '';
        }
      }));

      setStickers(stickerData);
    }

    getAllStickersInPackEffect(); // tslint:disable-line no-floating-promises
  }, [currentStickerPack]);


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
    <StickerPackDetail>
      <div className="properties">
        <div className="upper">
          <div className="titleWrapper">
            <div className="title">{currentStickerPack.title}</div>
            <div className="author">{author}</div>
          </div>
          <div className="controls">
            <Button onClick={handleAddToSignal}>
              <Octicon name="plus" />&nbsp;Add to Signal
            </Button>
          </div>
        </div>
        <ul>
          <li><Octicon name="globe" /> <strong>Source:</strong> <Linkify>{source}</Linkify></li>
          <li><Octicon name="file-directory" /> <strong>Stickers:</strong> {numStickers}</li>
          <li><Octicon name="tag" /> <strong>Tags:</strong> {Array.isArray(stickerPackTags) ? stickerPackTags.map(tag => (<span key={tag} className="tag">{tag}</span>)) : stickerPackTags}</li>
          <li><Octicon name="alert" /> <strong>NSFW:</strong> {currentStickerPack.nsfw ? 'Yes' : 'No'}</li>
        </ul>
      </div>
      <div className="stickers">
        {stickers.map((sticker, index) => (<img src={sticker} className="sticker" alt="Sticker" key={index} />))}
      </div>
    </StickerPackDetail>
  );
};


export default StickerPackDetailComponent;
