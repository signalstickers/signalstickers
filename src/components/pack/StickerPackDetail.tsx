import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import Linkify from 'react-linkify';
import {styled} from 'linaria/react';
import {darken} from 'polished';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';
import useAsyncEffect from 'use-async-effect';

import {GRAY, SIGNAL_BLUE} from 'etc/colors';
import {StickerPack} from 'etc/types';
import useQuery from 'hooks/use-query';
import {getStickerPack} from 'lib/stickers';
import {bp} from 'lib/utils';

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

  @media ${bp('sm')} {
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

  @media ${bp('md')} {
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

/**
 * Custom component for Linkify links that adds "target" and "rel" attributes.
 */
function LinkifyHrefDecorator(decoratedHref: string, decoratedText: string, key: number) {
  return (
    <a href={decoratedHref} key={key} target="_blank" rel="noreferrer">{decoratedText}</a>
  );
}


const StickerPackDetailComponent: React.FunctionComponent = () => {
  // Extract :packId from the URL.
  const {packId} = useParams<UrlParams>();

  // Extract the optional "key" query param from the URL.
  const key = useQuery().get('key') || undefined;

  // StickerPack object for the requested pack.
  const [stickerPack, setStickerPack] = useState<StickerPack>();

  // One of many possible error codes we may catch when trying to load or
  // decrypt a sticker pack. This will be used to determine what error message
  // to show the user.
  const [stickerPackError, setStickerPackError] = useState('');


  /**
   * [Effect] Set `stickerPack` when the component mounts.
   */
  useAsyncEffect(async () => {
    try {
      if (!packId) {
        return;
      }

      setStickerPack(await getStickerPack(packId, key));
    } catch (err) {
      if (err.code) {
        setStickerPackError(err.code);
      }
    }
  }, []);


  // ----- Render --------------------------------------------------------------

  if (!packId || !stickerPack) {
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

  const source = stickerPack.meta.source || 'N/A';
  const numStickers = stickerPack.manifest.stickers.length;
  // N.B. Signal allows strings containing only whitespace as authors. In these
  // cases, use 'Anonymous' instead.
  const author = stickerPack.manifest.author.trim() ? stickerPack.manifest.author : 'Anonymous';
  const stickerPackTags = stickerPack.meta.tags || [];
  const addToSignalHref = `https://signal.art/addstickers/#pack_id=${packId}&pack_key=${stickerPack.meta.key}`;


  // TODO: Fix logic around displaying home button to better detect when we're
  // viewing an unlisted sticker pack.
  return (
    <StickerPackDetail className="px-1 px-sm-4 py-4 mt-0 mt-sm-5 mb-5">
      <div className="row mb-4 flex-column-reverse flex-lg-row">
        <div className="col-12 col-lg-8 mt-4 mt-lg-0">
          <div className="title">{stickerPack.manifest.title}</div>
          <div className="author">{author}</div>
        </div>
        <div className="col-12 col-lg-4 d-flex d-lg-block justify-content-between text-md-right">
          {stickerPack.meta ? <Link to="/">
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

      {stickerPack.meta ? <div className="row mb-4">
        <div className="col-12 col-lg-6">
          <ul className="list-group">
            <li className="list-group-item text-wrap text-break">
              <Octicon name="globe" title="Source" />
              <div>
                <Linkify componentDecorator={LinkifyHrefDecorator}>{source}</Linkify>
              </div>
            </li>
            <li className="list-group-item text-wrap text-break">
              <Octicon name="file-directory" title="Sticker Count" />
              {numStickers}
            </li>
            {stickerPack.meta.nsfw ? <li className="list-group-item text-wrap text-break">
              <Octicon name="alert" title="NSFW" /> <strong>NSFW</strong>
            </li> : null}
            <li className="list-group-item">
              <Octicon name="tag" title="Tags" />
              <div className="text-wrap text-break">
                {stickerPackTags.length === 0 ? 'None' : stickerPackTags.map(tag => (<Tag key={tag}>{tag}</Tag>))}
              </div>
            </li>
          </ul>
        </div>
      </div> : null}

      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-wrap justify-content-around">
            {stickerPack.manifest.stickers.map(sticker => (<Sticker packId={packId} packKey={stickerPack.meta.key} stickerId={sticker.id} key={sticker.id} />))}
          </div>
        </div>
      </div>
    </StickerPackDetail>
  );
};


export default StickerPackDetailComponent;
