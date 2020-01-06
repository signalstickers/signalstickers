import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import Linkify from 'react-linkify';
import {styled} from 'linaria/react';
import {darken} from 'polished';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';
import * as R from 'ramda';
import useAsyncEffect from 'use-async-effect';

import {GRAY, SIGNAL_BLUE} from 'etc/colors';
import {StickerPackManifest, StickerPackMetadata} from 'etc/types';
import useQuery from 'hooks/use-query';
import ErrorWithCode from 'lib/error';
import {getStickerPack, getStickerPackList} from 'lib/stickers';
import {capitalizeFirst} from 'lib/utils';

import Sticker from './Sticker';
import StickerPackError from './StickerPackError';
import Tag from './Tag';


// ----- Types -----------------------------------------------------------------

/**
 * URL parameters that we expect to have set when this component is rendered.
 */
export interface UrlParams {
  packId: string;
}


// ----- Styles ----------------------------------------------------------------

const StickerPackDetail = styled.div`
  background-color: white;

  @media screen and (min-width: 576px) {
    border-radius: 4px;
    border: 1px solid ${darken(0.15, GRAY)};
  }

  & .list-group-item {
    align-items: center;
    display: flex;
    flex-direction: row;
    font-size: 14px;

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
    font-size: 32px;
    font-weight: 600;
  }

  @media screen and (min-width: 768px) {
    & .list-group-item {
      font-size: inherit;

      & .octicon {
        font-size: 20px;
        margin-right: 20px;
      }
    }

    & .title {
      font-size: 42px;
      font-weight: 600;
    }
  }

  & .author {
    font-size: 16px;
    font-weight: 400;
    opacity: 0.6;
  }

  & strong {
    font-weight: 600;
  }
`;


// ----- Component -------------------------------------------------------------

const StickerPackDetailComponent: React.FunctionComponent = () => {
  // Extract :packId from the URL.
  const {packId} = useParams<UrlParams>();


  // Extract the optional "key" query param from the URL.
  const key = useQuery().get('key');


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
   * [Effect] Set `stickerPack`, `stickerPackKey` and 'stickerPackMeta` when the
   * component mounts.
   */
  useAsyncEffect(async () => {
    try {
      // Because this value comes from a context, we may get rendered before
      // it becomes available.
      if (!packId) {
        return;
      }

      // Try to get metadata (including the pack's key) from stickers.json.
      const packMetadata = R.find<StickerPackMetadata>(R.propEq('id', packId), await getStickerPackList());

      // If the sticker pack is listed in stickers.json, set metadata and
      // then fetch the pack's manifest from Signal using the key from
      // metadata.
      if (packMetadata) {
        setStickerPackMeta(packMetadata);
        setStickerPackKey(packMetadata.key);
        setStickerPack(await getStickerPack(packId, packMetadata.key));
        return;
      }

      // Then try to load and decrypt the manifest from Signal using the key
      // from query params.
      if (key) {
        setStickerPackKey(key);
        setStickerPack(await getStickerPack(packId, key));
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
  }, []);


  // ----- Render --------------------------------------------------------------

  if (!packId || !stickerPackKey || !stickerPack) {
    // If an error code has been set, display an error alert to the user.
    if (stickerPackError) {
      switch (stickerPackError) {
        case 'NO_KEY_PROVIDED':
          return (
            <StickerPackError>
              <p>This sticker pack is not listed in the Signal Stickers directory. However, if you have the pack's <strong>key</strong>, you can still preview the sticker pack by supplying a <code>key</code> parameter in the URL.</p>
              <p>For example: <code>{`/pack/${packId}?key=sticker-pack-key`}</code></p>
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
  const addToSignalHref = `https://signal.art/addstickers/#pack_id=${packId}&pack_key=${stickerPackKey}`;

  return (
    <StickerPackDetail className="px-1 px-md-4 py-4 mt-0 mt-md-5 mb-5">
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
          <a href={addToSignalHref} target="_blank" rel="noreferrer" title="Add to Signal">
            <button className="btn btn-primary">
              <Octicon name="plus" />&nbsp;Add to Signal
            </button>
          </a>
        </div>
      </div>

      {stickerPackMeta ? <div className="row mb-4">
        <div className="col-12 col-lg-6">
          <ul className="list-group">
            <li className="list-group-item text-wrap text-break">
              <Octicon name="globe" title="Source" />
              <div>
                <Linkify>{source}</Linkify>
              </div>
            </li>
            <li className="list-group-item text-wrap text-break">
              <Octicon name="file-directory" title="Sticker Count" />
              {numStickers}
            </li>
            {stickerPackMeta.nsfw ? <li className="list-group-item text-wrap text-break">
              <Octicon name="alert" title="NSFW" /> <strong>NSFW</strong>
            </li> : null}
            <li className="list-group-item">
              <Octicon name="tag" title="Tags" />
              <div className="text-wrap text-break">
                {Array.isArray(stickerPackTags) ? stickerPackTags.map(tag => (<Tag key={tag}>{tag}</Tag>)) : 'None'}
              </div>
            </li>
          </ul>
        </div>
      </div> : null}

      <div className="row">
        <div className="col-12 p-2 p-sm-3">
          <div className="d-flex flex-wrap">
            {stickerPack.stickers.map(sticker => (<Sticker packId={packId} packKey={stickerPackKey} stickerId={sticker.id} key={sticker.id} />))}
          </div>
        </div>
      </div>
    </StickerPackDetail>
  );
};


export default StickerPackDetailComponent;
