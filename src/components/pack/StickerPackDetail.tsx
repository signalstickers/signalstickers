import {styled} from 'linaria/react';
import React, {useState, useContext} from 'react';
import {
  BsArrowLeftShort,
  BsAt,
  BsFolder,
  BsFillCameraVideoFill,
  BsPlus,
  BsStarFill,
  BsTag
} from 'react-icons/bs';
import {Link, useParams, useHistory} from 'react-router-dom';
import Linkify from 'react-linkify';
import useAsyncEffect from 'use-async-effect';

import ExternalLink from 'components/general/ExternalLink';
import StickersContext from 'contexts/StickersContext';
import {GRAY_DARKER} from 'etc/colors';
import {StickerPack} from 'etc/types';
import useQuery from 'hooks/use-query';
import {getStickerPack} from 'lib/stickers';
import {bp} from 'lib/utils';

import NsfwModal from './NsfwModal';
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
  & h1 {
    font-size: 2rem;
  }

  & strong {
    font-weight: 600;
  }

  & svg {
    font-size: 20px;

    &.arrow-left-icon,
    &.plus-icon {
      transform: scale(1.2) translateY(2px);
    }

    &.star-icon {
      color: gold;
    }
  }

  & .list-group-item {
    align-items: center;
    background-color: transparent;
    display: flex;
    flex-direction: row;
    font-size: 14px;
  }

  @media ${bp('sm')} {
    border: 1px solid rgba(0, 0, 0, .125);
    border-radius: 4px;
  }

  @media ${bp('md')} {
    & h1 {
      font-size: 2.5rem;
    }

    & .list-group-item {
      font-size: inherit;
    }
  }

  .theme-dark & {
    border-color: ${GRAY_DARKER};

    & .list-group-item {
      border-color: ${GRAY_DARKER};
    }
  }
`;

/**
 * N.B. We use CSS Grid here rather than the Bootstrap grid because it allows us
 * to specify odd numbers of identically-sized columns, which we cannot do in
 * Bootstrap's 12-column grid.
 */
const StickerGridView = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(2, 1fr);
  justify-content: space-between;

  @media ${bp('sm')} {
    grid-template-columns: repeat(3, 1fr);
  }

  @media ${bp('md')} {
    grid-template-columns: repeat(4, 1fr);
  }

  @media ${bp('lg')} {
    grid-template-columns: repeat(5, 1fr);
  }

  @media ${bp('xl')} {
    grid-template-columns: repeat(6, 1fr);
  }
`;


// ----- Component -------------------------------------------------------------

/**
 * Custom component for Linkify links that adds "target" and "rel" attributes.
 */
const linkifyHrefDecorator = (decoratedHref: string, decoratedText: string, key: number) => {
  return (
    <ExternalLink href={decoratedHref} key={key}>{decoratedText}</ExternalLink>
  );
};


const StickerPackDetailComponent: React.FunctionComponent = () => {
  const {setSearchQuery, searcher} = useContext(StickersContext);
  const history = useHistory();
  const query = useQuery();

  // Extract :packId from the URL.
  const {packId} = useParams<UrlParams>();

  // Extract the optional "key" query param from the URL.
  const key = typeof query.key === 'string' ? query.key : undefined;

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


  // ----- Render --------------------------------------------------------------

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
    <StickerPackDetail className="px-1 px-sm-4 py-4 mt-0 my-sm-4">
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

              {/* Sticker Count */}
              <li className="list-group-item text-wrap text-break">
                <BsFolder title="Sticker Count" className="mr-4 text-primary" />
                {stickerPack.manifest.stickers.length}
              </li>

              {/* Tags */}
              <li className="list-group-item">
                <BsTag title="Tags" className="mr-4 text-primary" />
                <div className="text-wrap text-break mb-n1">
                  {stickerPack.meta.tags && stickerPack.meta.tags.length > 0 ? stickerPack.meta.tags.map(tag => (
                    <Tag key={tag} className="mb-1 mr-1" label={tag} />
                  )) : 'None'}
                </div>
              </li>
            </ul>
          </div>
        </div>
      }

      {/* Stickers */}
      <div className="row">
        <div className="col-12">
          <StickerGridView>
            {stickerPack.manifest.stickers.map(sticker => (
              <Sticker
                packId={packId}
                packKey={stickerPack.meta.key}
                stickerId={sticker.id}
                key={sticker.id}
              />
            ))}
          </StickerGridView>
        </div>
      </div>
    </StickerPackDetail>
  );
};


export default StickerPackDetailComponent;
