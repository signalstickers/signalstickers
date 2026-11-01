import { getStickerPackManifest, StickerPackManifest } from '@signalstickers/stickers-client';
import { useFormikContext } from 'formik';
import pluralize from 'pluralize';
import React from 'react';

import LoadingSpinner from 'components/general/LoadingSpinner';
import { SIGNAL_ART_URL_PATTERN } from 'etc/constants';
import { getConvertedStickerInPack } from 'lib/stickers';


export interface Props {
  url: string;
}


/**
 * Error shown when a well-formed signal.art URL points to an invalid pack.
 * Must stay in sync with the signalArtUrl validator in Contribute.tsx.
 */
const INVALID_PACK_ERROR = 'Invalid sticker pack. Please check the pack ID and key.';


export default function PackPreviewCard(props: Props) {
  const { url } = props;
  const { setFieldError } = useFormikContext();
  const [manifest, setManifest] = React.useState<StickerPackManifest | null>(null);
  const [coverImage, setCoverImage] = React.useState<string | undefined>();
  const [isLoading, setIsLoading] = React.useState(false);


  /**
   * [Effect] Fetches the pack manifest (and cover image) for the current URL so
   * that the submitter gets a live preview of the pack they are contributing. A
   * well-formed URL pointing to an invalid pack sets the field error
   * immediately, without waiting for the first submit attempt.
   *
   * The 'cancelled' flag guards every setState and setFieldError call so that a
   * stale response cannot clear/set the error (or the preview) for a newer URL.
   */
  React.useEffect(() => {
    let cancelled = false;

    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(url);

    if (!matches) {
      // Empty / partial / garbage URL: clear the preview. The field error is
      // left alone on purpose — that is the validator's job at submit time.
      setManifest(null);
      setCoverImage(undefined);
      setIsLoading(false);
      return;
    }

    const [, packId, packKey] = matches;

    setIsLoading(true);

    void (async () => {
      let packManifest: StickerPackManifest;

      try {
        packManifest = await getStickerPackManifest(packId, packKey);
      } catch {
        if (!cancelled) {
          setManifest(null);
          setCoverImage(undefined);
          setIsLoading(false);
          setFieldError('signalArtUrl', INVALID_PACK_ERROR);
        }
        return;
      }

      if (cancelled) {
        return;
      }

      // The pack is valid: clear any stale error and show the card. The cover
      // is fetched afterwards so the text is available as soon as possible.
      setFieldError('signalArtUrl', undefined);
      setManifest(packManifest);
      setIsLoading(false);

      try {
        const image = await getConvertedStickerInPack(packId, packKey, packManifest.cover.id);
        if (!cancelled) {
          setCoverImage(image);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error(`[PackPreviewCard::Effect::GetCover] ${err.message}`);
        }
      }
    })();
  }, [
    url,
    setFieldError
  ]);


  // ----- Render --------------------------------------------------------------


  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!manifest) {
    return null;
  }

  return (
    <div className="d-flex align-items-center mt-2">
      {coverImage ?
        <img
          className="mr-3"
          style={{
            height: '72px',
            objectFit: 'contain',
            width: '72px'
          }}
          src={coverImage}
          alt="Cover"
        /> :
        <div
          className="mr-3"
          style={{
            height: '72px',
            width: '72px'
          }}
        />
      }
      <div>
        <div><b>{manifest.title}</b></div>
        {manifest.author && <div>by {manifest.author}</div>}
        <div>{manifest.stickers.length} {pluralize('sticker', manifest.stickers.length)}</div>
      </div>
    </div>
  );
}
