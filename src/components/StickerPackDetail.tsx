import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Linkify from 'react-linkify';
import {styled} from 'linaria/react';
import {darken} from 'polished';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';
import * as R from 'ramda';

import StickersContext from 'contexts/StickersContext';
import {GRAY, SIGNAL_BLUE} from 'etc/colors';
import {StickerPackManifest, StickerPackMetadata} from 'etc/types';
import Sticker from 'components/Sticker';
import useQuery from 'hooks/use-query';
import ErrorWithCode from 'lib/error';
import {getStickerPack, getStickerPackList} from 'lib/stickers';
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

/**
 * Sub-component used to render error messages.
 */
const StickerPackError: React.FunctionComponent = props => {
  return (
    <div className="p-4 my-4">
      <div className="row mb-4">
        <div className="col-10 offset-1 alert alert-danger">
          <h3 className="alert-heading mt-1 mb-3">Error</h3>
          {props.children}
        </div>
      </div>
    </div>
  );
};


const StickerPackDetailComponent: React.FunctionComponent = () => {
  const query = useQuery();

  // Sticker pack ID extracted from URL params.
  const {currentStickerPackId} = useContext(StickersContext);

  // This will be either the key extracted from a StickerPackMetadata object or,
  // if the user is trying to load an unlisted sticker pack, the 'key' query
  // param.
  const [stickerPackKey, setStickerPackKey] = useState<string | undefined>();

  // Sticker pack manifest from Signal.
  const [stickerPack, setStickerPack] = useState<StickerPackManifest>();

  // Sticker pack metadata from stickers.json. This will not be available if
  // viewing an unlisted pack.
  const [stickerPackMeta, setStickerPackMeta] = useState<StickerPackMetadata>();

  // One of many possible error codes we may catch when trying to load or
  // decrypt a sticker pack. This will be used to determine what error message
  // to show the user.
  const [stickerPackError, setStickerPackError] = useState('');


  /**
   * Accepts a "tags" property from a sticker pack's metadata and returns an
   * array of capitalized tags. If the string is empty, returns 'N/A'.
   */
  function parseStickerPackTags(tags: string | undefined) {
    if (!tags) {
      return;
    }

    const tagsArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length)
      .map(tag => tag.split(' ').map(capitalizeFirst).join(' '));

    if (tagsArray.length) {
      return tagsArray;
    }
  }


  /**
   * [Event Handler] Click handler for the Add to Signal button. Opens a new tab
   * allowing the user to add the sticker pack to the Signal app.
   */
  function handleAddToSignal() {
    if (!currentStickerPackId || !stickerPackKey) {
      return;
    }

    window.open(`sgnl://addstickers/?pack_id=${currentStickerPackId}&pack_key=${stickerPackKey}`, '_blank');
  }


  /**
   * [Effect] Update `stickerPack` and 'stickerPackMeta` when
   * `currentStickerPackId` changes.
   */
  useEffect(() => {
    async function setStickerPackEffect() {
      try {
        // Because this value comes from a context, we may get rendered before
        // it becomes available.
        if (!currentStickerPackId) {
          return;
        }

        // Try to get metadata (including the pack's key) from stickers.json.
        const packMetadata = R.find<StickerPackMetadata>(R.propEq('id', currentStickerPackId), await getStickerPackList());
        const keyFromQuery = query.get('key');

        // If the sticker pack is listed in stickers.json, set metadata and
        // then fetch the pack's manifest from Signal using the key from
        // metadata.
        if (packMetadata) {
          setStickerPackMeta(packMetadata);
          setStickerPackKey(packMetadata.key);
          setStickerPack(await getStickerPack(currentStickerPackId, packMetadata.key));
          return;
        }

        // Otherwise, try to load and decrypt the manifest from Signal using
        // the key provided in our query params.
        if (keyFromQuery) {
          setStickerPackKey(keyFromQuery);
          setStickerPack(await getStickerPack(currentStickerPackId, keyFromQuery));
          return;
        }

        // If we couldn't find the pack in our directory and the user did not
        // provide a `key` query param, throw.
        throw new ErrorWithCode('NO_KEY_PROVIDED', 'No key provided.');
      } catch (err) {
        if (err.code) {
          setStickerPackError(err.code);
        }
      }
    }

    setStickerPackEffect(); // tslint:disable-line no-floating-promises
  }, [currentStickerPackId]);


  // ----- Render --------------------------------------------------------------

  if (!currentStickerPackId || !stickerPackKey || !stickerPack) {
    // If an error code has been set, display an error alert to the user.
    if (stickerPackError) {
      switch (stickerPackError) {
        case 'NO_KEY_PROVIDED':
          return (
            <StickerPackError>
              <p>This sticker pack is not listed in the Signal Stickers directory. However, if you have the pack's <strong>key</strong>, you can still preview the sticker pack by supplying a <code>key</code> parameter in the URL.</p>
              <p>For example: <code>{`/pack/${currentStickerPackId}?key=sticker-pack-key`}</code></p>
            </StickerPackError>
          );
        case 'MANIFEST_DECRYPT':
          return (
            <StickerPackError>
              <p>The provided key is invalid.</p>
            </StickerPackError>
          );
        default:
          return (
            <StickerPackError>
              <p>An unknown error occurred ({stickerPackError}).</p>
            </StickerPackError>
          );
      }
    }

    // If we don't have an error, we're likely still waiting on an async
    // operation, so render nothing.
    return null; // tslint:disable-line no-null-keyword
  }

  const source = stickerPackMeta?.source || 'N/A';
  const numStickers = stickerPack.stickers.length;
  // N.B. Signal allows strings containing only whitespace as authors. In these
  // cases, use 'Anonymous' instead.
  const author = stickerPack.author.trim() ? stickerPack.author : 'Anonymous';
  const stickerPackTags = parseStickerPackTags(stickerPackMeta?.tags);

  return (
    <StickerPackDetail className="p-4 my-5">
      <div className="row mb-4 flex-column-reverse flex-lg-row">
        <div className="col-12 col-lg-8 mt-4 mt-lg-0">
          <div className="title">{stickerPack.title}</div>
          <div className="author">{author}</div>
        </div>
        <div className="col-12 col-lg-4 d-flex d-lg-block justify-content-between text-md-right">
          {stickerPackMeta ? <Link to="/">
            <button type="button" className="btn btn-link mr-2">
              Home
            </button>
          </Link> : null}
          <button className="btn btn-primary" onClick={handleAddToSignal}>
            <Octicon name="plus" />&nbsp;Add to Signal
          </button>
        </div>
      </div>

      {stickerPackMeta ? <div className="row mb-4">
        <div className="col-12 col-lg-6">
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
            {stickerPackMeta.nsfw ? <li className="list-group-item">
              <Octicon name="alert" title="NSFW" /> <strong>NSFW</strong>}
            </li> : null}
            <li className="list-group-item">
              <Octicon name="tag" title="Tags" />
              <div>
                {Array.isArray(stickerPackTags) ? stickerPackTags.map(tag => (<span key={tag} className="tag">{tag}</span>)) : 'None'}
              </div>
            </li>
          </ul>
        </div>
      </div> : null}

      <div className="row">
        <div className="col-12 p-2 p-sm-3">
          <div className="d-flex flex-wrap">
            {stickerPack.stickers.map(sticker => (<Sticker packId={currentStickerPackId} packKey={stickerPackKey} stickerId={sticker.id} key={sticker.id} />))}
          </div>
        </div>
      </div>
    </StickerPackDetail>
  );
};


export default StickerPackDetailComponent;
