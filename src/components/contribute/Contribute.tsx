import cx from 'classnames';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  type FieldValidator,
  type FormikHelpers
} from 'formik';
import * as R from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAsyncEffect } from 'use-async-effect';

import ExternalLink from 'components/general/ExternalLink';
import {
  SIGNAL_ART_URL_PATTERN,
  API_URL_CONTRIBUTION_REQUEST,
  API_URL_CONTRIBUTE
} from 'etc/constants';
import { getStickerPackDirectory, getStickerPack } from 'lib/stickers';

/**
 * Test pack:
 * https://signal.art/addstickers/#pack_id=b2e52b07dfb0af614436508c51aa24eb&pack_key=66224990b3e956ad4a735830df8cd071275afeae79db9797e57d99314daffc77
 */


interface FormValues {
  signalArtUrl: string;
  source: string;
  tags: string;
  isNsfw: 'true' | 'false' | null;
  isOriginal: 'true' | 'false' | null;
  secAnswer: string;
  submitterComments: string;
}


/**
 * Regular expression used to validate lists of tags.
 */
const TAGS_PATTERN = /^(?:([\w ]+))+(?:, ?([\w ]+))*$/g;


/**
 * Initial values for the form.
 */
const initialValues: FormValues = {
  signalArtUrl: '',
  source: '',
  tags: '',
  isNsfw: null,
  isOriginal: null,
  secAnswer: '',
  submitterComments: ''
};


/**
 * Validators for each field in our form.
 */
const validators: Record<string, FieldValidator> = {
  signalArtUrl: async (signalArtUrl: string) => {
    if (!signalArtUrl) return 'This field is required.';

    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(signalArtUrl);
    if (!matches) return 'Invalid signal.art URL.';

    const [, packId, packKey] = matches;

    if (R.find(R.pathEq(packId, ['meta', 'id']), await getStickerPackDirectory())) {
      return 'A sticker pack with that ID already exists in the directory.';
    }

    try {
      await getStickerPack(packId, packKey);
    } catch {
      return 'Invalid sticker pack. Please check the pack ID and key.';
    }
  },
  source: (source: string) => {
    if (source && source.length > 320) {
      return 'This field must be no longer than 320 characters.';
    }
  },
  tags: (tags: string) => {
    if (tags !== '' && !new RegExp(TAGS_PATTERN).test(tags)) {
      return 'Invalid value. Tags must be a list of comma-delimited strings.';
    }
  },
  isNsfw: (isNsfw?: boolean) => {
    if (isNsfw === null) return 'This field is required.';
  },
  isOriginal: (isOriginal?: boolean) => {
    if (isOriginal === null) return 'This field is required.';
  },
  secAnswer: (secAnswer: string) => {
    if (secAnswer === '') return 'This field is required.';
  }
};


export default function ContributePack() {
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [contributionRequestId, setContributionRequestId] = React.useState('');
  const [contributionRequestQuestion, setContributionRequestQuestion] = React.useState('');
  const [isInitialized, setIsInitialized] = React.useState(false);


  /**
   * [Effect] Fetches a contribution request challenge question.
   */
  useAsyncEffect(async isMounted => {
    if (isInitialized) return;

    const response = await fetch(API_URL_CONTRIBUTION_REQUEST, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();

    if (!isMounted()) return;

    setContributionRequestId(json.contribution_id);
    setContributionRequestQuestion(json.contribution_question);
    setIsInitialized(true);
  }, [isInitialized]);


  /**
   * Called when the form is submitted _after_ it has passed validation.
   */
  const onSubmit = React.useCallback(async (values: FormValues, { setStatus }: FormikHelpers<FormValues>) => {
    // Extract pack ID and key from provided signal.art URL.
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(values.signalArtUrl);
    if (!matches) throw new Error('Unable to extract pack ID and pack key from signal.art URL.');
    const [, packId, packKey] = matches;
    const { source, isNsfw, isOriginal, secAnswer, submitterComments } = values;

    // Split tags into an array, trim whitespace, and remove empty tags.
    const tags = R.reject(R.isEmpty, R.map(R.trim, R.split(',', values.tags)));

    const propositionData = {
      contribution_id: contributionRequestId,
      pack: {
        pack_id: packId,
        pack_key: packKey,
        source: source,
        tags: tags,
        nsfw: isNsfw === 'true' ? true : false,
        original: isOriginal === 'true' ? true : false
      },
      contribution_answer: secAnswer,
      submitter_comments: submitterComments
    };

    const response = await fetch(API_URL_CONTRIBUTE, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(propositionData)
    });

    const data = await response.json();

    if (response.status !== 200) {
      // Set any errors from the API on the form's status.
      setStatus({
        state: 'error',
        error: data.error ?? 'An unknown error occurred.'
      });

      return;
    }

    setStatus({ state: 'success' });
  }, [contributionRequestId]);


  const stickerPackGuideLink = React.useMemo(() => (
    <ExternalLink
      href="https://support.signal.org/hc/articles/360031836512-Stickers#h_c2a0a45b-862f-4d12-9ab1-d9a6844062ca"
      title="Sticker Creator Guidelines"
    >
      Sticker Creator Guidelines
    </ExternalLink>
  ), []);


  const contributionGuidelines = React.useMemo(() => (
    <ExternalLink
      href="https://github.com/signalstickers/signalstickers#contribution-guidelines"
      title="Signalstickers' Contribution Guidelines"
    >
      Signal Stickers' Contribution Guidelines
    </ExternalLink>
  ), []);


  return (
    <div className="my-3 my-sm-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Contribute</h1>
          <p className="mt-lg-3 mb-4">
            To get your sticker pack listed in the Signal Stickers directory:
          </p>
          <ol>
            <li className="mb-2">
              Create a sticker pack using the Signal desktop app. For help, see Signal's {stickerPackGuideLink}.
              Be sure to save the <code>signal.art</code> URL for your pack. If you are creating a
              sticker pack derived from an existing one on another platform or from someone else's
              artwork, please consider using the original author's name in the <strong>Author</strong> field
              when creating your pack in Signal, and consider adding their website, Twitter handle, or
              other online presence to the <strong>Source</strong> field below.
            </li>
            <li className="mb-2">
              Fill-out this form. Please check that your pack is not already listed on the website.
              Take the time to add tags, to help other users find your pack!
            </li>
            <li className="mb-2">
              We will review the pack, and if it meets the {contributionGuidelines}, it will be publicly available
              on <code>signalstickers.org</code> !
            </li>
          </ol>
          <p>
            To check the status of your contribution, <Link to="/contribution-status">click here.</Link>
          </p>
        </div>
      </div>

      <hr className="pt-3 pb-2" />

      <div className="row">
        <div className="col-12 col-md-10 offset-md-1">
          <Formik
            initialStatus={{ state: 'pristine' }}
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnChange={submitAttempted}
            validateOnBlur={submitAttempted}
          >
            {({ errors, isSubmitting, status, dirty, setStatus }) => {
              if (status.state === 'pristine' && dirty) setStatus({ state: 'dirty' });
              const disabled = isSubmitting || status.state === 'success';

              return (
                <Form noValidate>

                  {/* [Field] Signal.art URL */}
                  <div className="mb-4">
                    <label
                      className="form-label"
                      htmlFor="signal-art-url"
                    >
                      Signal.art URL
                    </label>
                    <Field
                      id="signal-art-url"
                      type="text"
                      name="signalArtUrl"
                      className={cx(
                        'form-control form-control-lg bg-transparent',
                        errors.signalArtUrl && 'is-invalid'
                      )}
                      disabled={disabled}
                      validate={validators.signalArtUrl}
                      placeholder="https://signal.art/addstickers/#pack_id=<packId>&pack_key=<packKey>"
                      aria-describedby="signal-art-url-error"
                    />
                    <div
                      id="signal-art-url-error"
                      className={cx(errors.signalArtUrl && 'invalid-feedback')}
                    >
                      <ErrorMessage name="signalArtUrl" />&nbsp;
                    </div>
                  </div>

                  {/* [Field] Source */}
                  <div className="mb-4">
                    <label
                      className="form-label"
                      htmlFor="source"
                    >
                      Source <span className="text-muted">(optional)</span>
                    </label>
                    <Field
                      type="text"
                      id="source"
                      name="source"
                      validate={validators.source}
                      className={cx(
                        'form-control form-control-lg bg-transparent',
                        errors.source && 'is-invalid'
                      )}
                      disabled={disabled}
                      aria-describedby="source-description source-error"
                    />
                    <div
                      id="source-description"
                      className="form-text"
                    >
                      Original author, website, company, etc.
                    </div>
                    <div
                      id="source-error"
                      className={cx(errors.source && 'invalid-feedback')}
                    >
                      <ErrorMessage name="source" />&nbsp;
                    </div>
                  </div>

                  {/* [Field] Tags */}
                  <div className="mb-4">
                    <label
                      className="form-label"
                      htmlFor="tags"
                    >
                      Tags <span className="text-muted">(optional)</span>
                    </label>
                    <Field
                      type="text"
                      id="tags"
                      name="tags"
                      validate={validators.tags}
                      className={cx(
                        'form-control form-control-lg bg-transparent',
                        errors.tags && 'is-invalid'
                      )}
                      disabled={disabled}
                      aria-describedby="tags-description tags-error"
                    />
                    <div
                      id="tags-description"
                      className="form-text"
                    >
                      Comma-separated list of words.
                    </div>
                    <div
                      id="tags-error"
                      className={cx(errors.tags && 'invalid-feedback')}
                    >
                      <ErrorMessage name="tags" />&nbsp;
                    </div>
                  </div>

                  {/* [Field] NSFW */}
                  <div className="mb-4">
                    <legend
                      id="is-nsfw-description"
                      className="form-label fs-5"
                    >
                      Is your sticker pack <ExternalLink href="https://www.urbandictionary.com/define.php?term=NSFW" title="NSFW">NSFW</ExternalLink>?
                    </legend>
                    <div className="form-check fs-5">
                      <Field
                        type="radio"
                        id="is-nsfw-true"
                        name="isNsfw"
                        validate={validators.isNsfw}
                        className={cx('form-check-input', errors.isNsfw && 'is-invalid')}
                        disabled={disabled}
                        required
                        aria-describedby="is-nsfw-description is-nsfw-error"
                        value="true"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="is-nsfw-true"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check fs-5">
                      <Field
                        type="radio"
                        id="is-nsfw-false"
                        name="isNsfw"
                        validate={validators.isNsfw}
                        className={cx('form-check-input', errors.isNsfw && 'is-invalid')}
                        disabled={disabled}
                        required
                        aria-describedby="is-nsfw-description is-nsfw-error"
                        value="false"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="is-nsfw-false"
                      >
                        No
                      </label>
                      <div
                        id="is-nsfw-error"
                        className={cx(errors.isNsfw && 'invalid-feedback')}
                      >
                        <ErrorMessage name="isNsfw" />&nbsp;
                      </div>
                    </div>
                  </div>

                  {/* [Field] Original */}
                  <div className="mb-4">
                    <legend
                      id="is-original-description"
                      className="form-label fs-5"
                    >
                      Is your pack original? Did the author of the pack draw it exclusively for Signal, from original artworks?
                    </legend>
                    <div className="form-check fs-5">
                      <Field
                        type="radio"
                        id="is-original"
                        name="isOriginal"
                        validate={validators.isOriginal}
                        className={cx('form-check-input', errors.isOriginal && 'is-invalid')}
                        disabled={disabled}
                        required
                        aria-describedby="is-original-description is-original-error"
                        value="true"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="is-original-true"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="form-check fs-5">
                      <Field
                        type="radio"
                        id="is-original-false"
                        name="isOriginal"
                        validate={validators.isOriginal}
                        className={cx('form-check-input', errors.isOriginal && 'is-invalid')}
                        disabled={disabled}
                        required
                        aria-describedby="is-original-description is-original-error"
                        value="false"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="is-original-false"
                      >
                        No
                      </label>
                      <div
                        id="is-original-error"
                        className={cx(errors.isOriginal && 'invalid-feedback')}
                      >
                        <ErrorMessage name="isOriginal" />&nbsp;
                      </div>
                    </div>
                  </div>

                  {/* [Field] Security Answer */}
                  <div className="mb-4">
                    <label
                      className="fs-5 mb-1"
                      htmlFor="sec-answer"
                    >
                      {contributionRequestQuestion || <span className="text-muted">Loading...</span>}
                    </label>
                    <Field
                      type="text"
                      id="sec-answer"
                      name="secAnswer"
                      validate={validators.secAnswer}
                      className={cx(
                        'form-control form-control-lg bg-transparent',
                        errors.secAnswer && 'is-invalid'
                      )}
                      disabled={disabled}
                      aria-labelledby="sec-answer-description sec-answer-error"
                    />
                    <div
                      id="sec-answer-description"
                      className="form-text"
                    >
                      This question helps us to make sure that you are not a robot. The answer is a single word or number, without quotes.
                    </div>
                    <div
                      id="sec-answer-error"
                      className={cx(errors.secAnswer && 'invalid-feedback')}
                    >
                      <ErrorMessage name="secAnswer" />&nbsp;
                    </div>
                  </div>

                  {/* [Field] Submitter Comments */}
                  <div className="mb-4">
                    <label
                      className="fs-5 mb-1"
                      htmlFor="submitter-comments"
                    >
                      Any comments? <span className="text-muted">(optional)</span>
                    </label>
                    <Field
                      as="textarea"
                      type="textarea"
                      id="submitter-comments"
                      name="submitterComments"
                      className="form-control form-control-lg bg-transparent"
                      disabled={isSubmitting || status.state === 'success'}
                      maxLength="400"
                      aria-describedby="submitter-comments-description"
                    />
                    <div
                      id="submitter-comments-description"
                      className="form-text"
                    >
                      This will only be visible to moderators. Do not enter personal information. Or just say hello, we love it :-)
                    </div>
                  </div>

                  {/* Global Form Status */}
                  <div className="mb-4">
                    {status.state === 'success' ? (
                      <span className="text-success">Proposal submitted, thanks!</span>
                    ) : status.state === 'error' ? (
                      <span className="text-danger">{status.error}</span>
                    ) : <span>&nbsp;</span>}
                  </div>

                  {/* [Control] Submit and Reset */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className={cx(
                        'btn btn-lg',
                        status.state === 'success' ? 'btn-success' : 'btn-primary'
                      )}
                      disabled={disabled || status.state === 'success'}
                      onClick={() => setSubmitAttempted(true)}
                    >
                      {status.state === 'success' ? 'Success' : 'Submit Pack Proposal'}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}
