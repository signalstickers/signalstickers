import cx from 'classnames';
import pluralize from 'pluralize';
import React from 'react';
import {
  BsArrowLeftShort,
  BsAt,
  BsFillHeartFill,
  BsFillCameraVideoFill,
  BsPlus,
  BsStarFill,
  BsTag
} from 'react-icons/bs';
import { ImEye } from 'react-icons/im';
import Linkify from 'react-linkify';
import { Link, useParams, useHistory } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import ExternalLink from 'components/general/ExternalLink';
import StickersContext from 'contexts/StickersContext';
import { StickerPack } from 'etc/types';
import useQuery from 'hooks/use-query';
import { getStickerPack } from 'lib/stickers';
import { sendPackBeacon } from 'lib/utils';

import NsfwModal from './NsfwModal';
import Sticker from './Sticker';
import classes from './StickerPackDetail.css';
import StickerPackError from './StickerPackError';
import Tag from './Tag';


/**
 * URL parameters that we expect to have set when this component is rendered.
 */
export interface UrlParams {
  packId: string;
}


/**
 * Custom component for Linkify links that adds "target" and "rel" attributes.
 */
const linkifyHrefDecorator = (decoratedHref: string, decoratedText: string, key: number) => {
  return (
    <ExternalLink href={decoratedHref} key={key}>{decoratedText}</ExternalLink>
  );
};


export default function StickerPackDetail() {
  const { setSearchQuery, searcher } = React.useContext(StickersContext);
  const history = useHistory();
  const query = useQuery();

  // Extract :packId from the URL.
  const { packId } = useParams<UrlParams>();

  // Extract the optional "key" query param from the URL.
  const key = typeof query.key === 'string' ? query.key : undefined;

  // StickerPack object for the requested pack.
  const [stickerPack, setStickerPack] = React.useState<StickerPack>();

  // One of many possible error codes we may catch when trying to load or
  // decrypt a sticker pack. This will be used to determine what error message
  // to show the user.
  const [stickerPackError, setStickerPackError] = React.useState('');


  /**
   * [Effect] Set `stickerPack` when the component mounts.
   */
  useAsyncEffect(async () => {
    try {
      if (!packId) {
        return;
      }

      setStickerPack(await getStickerPack(packId, key));
      sendPackBeacon(packId);
    } catch (err: any) {
      if (err.code) {
        setStickerPackError(err.code);
      }
    }
  }, [
    key,
    packId
  ]);


  /**
   * [Event Handler] Search for packs from the same author.
   */
  const onAuthorClick = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();

    if (searcher && event.currentTarget.textContent) {
      setSearchQuery(searcher.buildQueryString({
        attributeQueries: [{
          author: event.currentTarget.textContent
        }]
      }));

      history.push('/');
    }
  }, [
    history,
    searcher,
    setSearchQuery
  ]);


  if (!packId || !stickerPack) {
    // If an error code has been set, display an error alert to the user.
    if (stickerPackError) {
      switch (stickerPackError) {
        case 'NO_KEY_PROVIDED':
          return (
            <StickerPackError>
              <p>
                This sticker pack is not listed in the Signal Stickers directory.
                However, if you have the pack's <strong>key</strong>, you can
                still preview the sticker pack by supplying a <code>key</code>
                parameter in the URL.
              </p>
              <p>
                For example: <code>{`/pack/${packId}?key=sticker-pack-key`}</code>
              </p>
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
    return null;
  }

  // N.B. Signal allows strings containing only whitespace as authors. In these
  // cases, use 'Anonymous' instead.
  const author = stickerPack.manifest.author.trim() ? stickerPack.manifest.author : 'Anonymous';

  return (
    <div
      className={cx(classes.stickerPackDetail, 'px-1 px-sm-4 py-4 mt-0 my-sm-4')}
    >
      {stickerPack.meta.nsfw && <NsfwModal />}

      {/* Header */}
      <div className="row mb-4 flex-column-reverse flex-lg-row">
        <div className="col-12 col-lg-8 mt-2 mt-lg-0">
          <h1>{stickerPack.manifest.title}</h1>
          <button
            type="button"
            role="link"
            title={`View more packs from ${author}`}
            className="btn btn-link p-0 border-0 text-left"
            onClick={onAuthorClick}
          >
            {author}
          </button>
        </div>
        <div className="col-12 col-lg-4 d-flex d-lg-block justify-content-between text-md-right mb-3 mb-lg-0">
          {stickerPack.meta.unlisted ?
            null :
            <Link to="/" className="btn btn-light mr-2">
              <BsArrowLeftShort className="arrow-left-icon" /> Back
            </Link>
          }
          <ExternalLink
            href={`https://signal.art/addstickers/#pack_id=${packId}&pack_key=${stickerPack.meta.key}`}
            className="btn btn-primary"
            title="Add to Signal"
          >
            <BsPlus className="plus-icon" /> Add to Signal
          </ExternalLink>
        </div>
      </div>

      {/* Metadata Table */}
      {!stickerPack.meta.unlisted &&
        <div className="row mb-4">
          <div className="col-12 col-lg-9">
            <ul className="list-group">

              {/* Original */}
              {stickerPack.meta.original &&
                <li className="list-group-item text-wrap text-break">
                  <BsStarFill title="Original" className="star-icon mr-4" />
                  This pack has been created exclusively for Signal by the artist, from original artworks.
                </li>
              }

              {/* Animated */}
              {stickerPack.meta.animated &&
                <li className="list-group-item text-wrap text-break">
                  <BsFillCameraVideoFill title="Animated" className="text-primary mr-4" />
                  This pack contains animated stickers!
                </li>
              }

              {/* Editor's choice */}
              {stickerPack.meta.editorschoice &&
                <li className="list-group-item text-wrap text-break">
                  <BsFillHeartFill title="Editor's choice" className="text-primary mr-4" />
                  Editor's choice: we love this pack!
                </li>
              }

              {/* Source */}
              {stickerPack.meta.source &&
                <li className="list-group-item text-wrap text-break">
                  <BsAt title="Source" className="mr-4 text-primary mention-icon" />
                  <div>
                    <Linkify componentDecorator={linkifyHrefDecorator}>
                      {stickerPack.meta.source}
                    </Linkify>
                  </div>
                </li>
              }

              {/* Pack views */}
              <li className="list-group-item text-wrap text-break">
                <ImEye className="mr-4 text-primary" />  {stickerPack.meta.hotviews ?? 0} {pluralize('view', stickerPack.meta.hotviews)} last month, {stickerPack.meta.totalviews ?? 0} total
              </li>

              {/* Tags */}
              {stickerPack.meta.tags && stickerPack.meta.tags.length > 0 &&
                <li className="list-group-item">
                  <BsTag title="Tags" className="mr-4 text-primary" />
                  <div className="text-wrap text-break mb-n1">
                    { stickerPack.meta.tags.map(tag => (
                      <Tag key={tag} className="mb-1 mr-1" label={tag} />
                    ))}
                  </div>
                </li>
              }
            </ul>
          </div>
        </div>
      }

      {/* Stickers */}
      <div className="row">
        <div className="col-12">
          <div className={classes.stickerGridView}>
            {stickerPack.manifest.stickers.map(sticker => (
              <Sticker
                packId={packId}
                packKey={stickerPack.meta.key}
                stickerId={sticker.id}
                key={sticker.id}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="nbStickers row justify-content-center align-items-center mt-4">
        <small className="mr-3">
          {stickerPack.manifest.stickers.length}
          {' '}
          {pluralize('sticker', stickerPack.manifest.stickers.length)}
        </small>
        <Link to={`/pack/${packId}/report`}>
          <small>🚨 Report this pack</small>
        </Link>
      </div>
    </div>
  );
}
