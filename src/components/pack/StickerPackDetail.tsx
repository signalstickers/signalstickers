import cx from 'classnames';
import pluralize from 'pluralize';
import React from 'react';
import { AiOutlineVideoCamera } from 'react-icons/ai';
import {
  BsAt,
  BsEye,
  BsPlus,
  BsShare,
  BsStar,
  BsTag
} from 'react-icons/bs';
import { IoMdHeartEmpty } from 'react-icons/io';
import Linkify from 'react-linkify';
import { Link, useParams, useHistory } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import ExternalLink from 'components/general/ExternalLink';
import Tag from 'components/general/Tag';
import StickersContext from 'contexts/StickersContext';
import globalClasses from 'etc/global-styles.css';
import { StickerPack } from 'etc/types';
import useDocumentTitle from 'hooks/use-document-title';
import useQuery from 'hooks/use-query';
import { getStickerPack } from 'lib/stickers';
import { sendPackBeacon } from 'lib/utils';

import ContentWarningModal from './ContentWarningModal';
import Sticker from './Sticker';
import classes from './StickerPackDetail.css';
import StickerPackError from './StickerPackError';


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

  // When the sticker pack has loaded, update the document title. It will revert
  // to its previous value when the component un-mounts.
  useDocumentTitle(stickerPack?.manifest.title && `Signal Stickers - ${stickerPack?.manifest.title}`);


  /**
   * [Effect] Set `stickerPack` when the component mounts.
   */
  useAsyncEffect(async isMounted => {
    try {
      if (!packId) return;
      const pack = await getStickerPack(packId, key);
      if (!isMounted()) return;
      setStickerPack(pack);
      sendPackBeacon(packId);
    } catch (err: any) {
      if (err.code) setStickerPackError(err.code);
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
    const author = event.currentTarget.textContent;

    if (searcher && author) {
      setSearchQuery(searcher.buildQueryString({
        expression: { $and: [{ author }] }
      }));

      history.push('/');
    }
  }, [
    history,
    searcher,
    setSearchQuery
  ]);


  /**
   * [Memo] Signal allows strings containing only whitespace as authors. Many
   * contributors also use one or more periods in this field, which is visually
   * janky and confusing to users. In these cases, use 'Anonymous' instead.
   */
  const authorFragment = React.useMemo(() => {
    if (!stickerPack) return;
    const { author } = stickerPack.manifest;
    if (author.trim() === '') return 'Anonymous';
    if (/^\.+$/g.test(author)) return 'Anonymous';
    return author;
  }, [stickerPack?.manifest.author]);


  /**
   * [Memo] Renders a share button that uses the Web Share API, if available.
   * Typically, this will only appear on devices where it may be difficult or
   * impossible (re: standalone mode) for the user to quickly and easily copy
   * the current URL.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
   */
  const shareFragment = React.useMemo(() => {
    const shareData: ShareData = {
      title: document.title,
      url: document.location.href
    };

    if (!navigator.canShare || !navigator.canShare(shareData)) return;

    return (
      <button
        type="button"
        title="Share"
        className="btn btn-primary d-flex fs-5 align-items-center"
        onClick={() => void navigator.share(shareData)}
      >
        {/* We need a hair-space here to ensure proper button height. */}
        <BsShare className="fs-4" />&#8202;
      </button>
    );
  }, [stickerPack]);


  if (!packId || !stickerPack) {
    // If an error code has been set, display an error alert to the user.
    if (stickerPackError) {
      switch (stickerPackError) {
        case 'INVALID_PACK_ID':
          return (
            <StickerPackError>
              <p>Invalid pack ID: <code>{packId}</code></p>
            </StickerPackError>
          );
        case 'NO_KEY_PROVIDED':
          return (
            <StickerPackError>
              <p>
                This sticker pack is not listed in the Signal Stickers directory.
                However, if you have the pack's <strong>key</strong>, you can
                still preview the sticker pack by supplying a <code>key</code>{' '}
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


  return (
    <div className="my-3 my-sm-4 d-flex flex-column flex-grow-1">
      {stickerPack.meta.nsfw && <ContentWarningModal />}

      {/* Header */}
      <div className="row mb-4 flex-column-reverse flex-md-row">
        <div className="col-12 col-md-8">
          {/* Title */}
          <h1>{stickerPack.manifest.title}</h1>

          {/* Author */}
          <button
            type="button"
            role="link"
            title={`View more packs from ${authorFragment}`}
            className="btn btn-link text-primary text-decoration-none p-0 border-0 text-left fs-5"
            onClick={onAuthorClick}
          >
            {authorFragment}
          </button>
        </div>

        {/* Add to Signal / Share */}
        <div className="col-12 col-md-4 mb-3 mb-lg-0 d-flex align-items-start justify-content-end gap-3">
          <ExternalLink
            href={`https://signal.art/addstickers/#pack_id=${packId}&pack_key=${stickerPack.meta.key}`}
            className="btn btn-primary fs-5 d-flex align-items-center"
            title="Add to Signal"
          >
            <BsPlus className="fs-4" /> Add to Signal
          </ExternalLink>
          {shareFragment}
        </div>
      </div>

      {/* Metadata Table */}
      {!stickerPack.meta.unlisted &&
        <div className="row mb-3 mb-md-4">
          <div className="col-12">
            <ul className="list-group shadow-sm">

              {/* Editor's Choice */}
              {stickerPack.meta.editorschoice &&
                <li
                  className={cx(
                    classes.stickerPackMetadataItem,
                    'list-group-item d-flex align-items-center text-wrap text-break'
                  )}
                >
                  <IoMdHeartEmpty
                    title="Editor's Choice"
                    className="text-danger fs-5 me-2"
                    style={{ transform: 'scale(1.1)' }}
                  />
                  <span className="text-body-secondary ps-1">
                    Editor's Choice: We love this pack!
                  </span>
                </li>
              }

              {/* Original */}
              {stickerPack.meta.original &&
                <li
                  className={cx(
                    classes.stickerPackMetadataItem,
                    'list-group-item d-flex align-items-center text-wrap text-break'
                  )}
                >
                  <BsStar
                    title="Original"
                    className="text-warning fs-5 me-2"
                  />
                  <span className="text-body-secondary ps-1">
                    This pack has been created exclusively for Signal by the artist, from original artworks.
                  </span>
                </li>
              }

              {/* Animated */}
              {stickerPack.meta.animated &&
                <li
                  className={cx(
                    classes.stickerPackMetadataItem,
                    'list-group-item d-flex align-items-center text-wrap text-break'
                  )}
                >
                  <AiOutlineVideoCamera
                    title="Animated"
                    className="text-secondary fs-5 me-2"
                  />
                  <span className="text-body-secondary ps-1">
                    This pack contains animated stickers!
                  </span>
                </li>
              }

              {/* Source */}
              {stickerPack.meta.source &&
                <li
                  className={cx(
                    classes.stickerPackMetadataItem,
                    'list-group-item d-flex align-items-center text-wrap text-break'
                  )}
                >
                  <BsAt
                    title="Source"
                    className="text-secondary fs-4 me-2"
                  />
                  <span className="text-body-secondary">
                    <Linkify componentDecorator={linkifyHrefDecorator}>
                      {stickerPack.meta.source}
                    </Linkify>
                  </span>
                </li>
              }

              {/* Tags */}
              {stickerPack.meta.tags && stickerPack.meta.tags.length > 0 &&
                <li
                  className={cx(
                    classes.stickerPackMetadataItem,
                    'list-group-item d-flex align-items-center text-wrap text-break'
                  )}
                >
                  <BsTag
                    title="Tags"
                    className="text-secondary fs-4 me-1"
                    style={{ transform: 'scale(0.9)' }}
                  />
                  <span className="d-flex flex-wrap gap-1 ms-1">
                    {stickerPack.meta.tags.map(tag => <Tag key={tag} label={tag} />)}
                  </span>
                </li>
              }

              {/* Pack Views */}
              <li
                className={cx(
                  classes.stickerPackMetadataItem,
                  'list-group-item d-flex align-items-center text-wrap text-break'
                )}
              >
                <BsEye
                  title="Views"
                  className="text-secondary fs-5 me-3"
                />
                <span className="text-body-secondary">
                  {(stickerPack.meta.hotviews ?? 0).toLocaleString()} {pluralize('view', stickerPack.meta.hotviews)} last month,
                  {' '}
                  {(stickerPack.meta.totalviews ?? 0).toLocaleString()} total
                </span>
              </li>
            </ul>
          </div>
        </div>
      }

      {/* Stickers */}
      <div className="row flex-grow-1">
        <div className="col-12">
          <div className={globalClasses.gridView}>
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
      <div className="row">
        <div className="col-12 d-flex mt-4 gap-4">
          <div className="text-end text-muted w-50">
            {stickerPack.manifest.stickers.length}
            {' '}
            {pluralize('sticker', stickerPack.manifest.stickers.length)}
          </div>
          <div className="vr" />
          <div className="w-50">
            <Link to={`/pack/${packId}/report`}>Report Pack</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
