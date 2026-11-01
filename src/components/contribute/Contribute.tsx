import cx from 'classnames';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldValidator
} from 'formik';
import * as R from 'ramda';
import React from 'react';
import { Link } from 'react-router-dom';

import ExternalLink from 'components/general/ExternalLink';
import PackPreviewCard from 'components/contribute/PackPreviewCard';
import TagInput from 'components/contribute/TagInput';
import { SIGNAL_ART_URL_PATTERN } from 'etc/constants';
import { ContributePayload } from 'etc/types';
import { ApiError, contributePack, errorFieldPath, getSecurityQuestion } from 'lib/api';
import { getStickerPackDirectory, getStickerPack } from 'lib/stickers';

/**
 * Test pack:
 * https://signal.art/addstickers/#pack_id=b2e52b07dfb0af614436508c51aa24eb&pack_key=66224990b3e956ad4a735830df8cd071275afeae79db9797e57d99314daffc77
 */


export interface FormValues {
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
 * Maximum number of tags accepted by the API.
 */
const MAX_TAGS = 40;


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
    if (!signalArtUrl) {
      return 'This field is required.';
    }

    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(signalArtUrl);

    if (!matches) {
      return 'Invalid signal.art URL.';
    }

    const [, packId, packKey] = matches;

    // @ts-expect-error
    if (R.find(R.pathEq(['meta', 'id'], packId), await getStickerPackDirectory())) {
      return 'A sticker pack with that ID already exists in the directory.';
    }

    try {
      await getStickerPack(packId, packKey);
    } catch {
      return 'Invalid sticker pack. Please check the pack ID and key.';
    }
  },
  source: (source: string) => {
    if (source && source.length > 256) {
      return 'This field must be no longer than 256 characters.';
    }
  },
  tags: (tags: string) => {
    if (tags !== '' && !new RegExp(TAGS_PATTERN).test(tags)) {
      return 'Invalid value. Tags must be a list of comma-delimited strings.';
    }
  },
  isNsfw: (isNsfw: boolean) => {
    if (isNsfw === null) {
      return 'This field is required.';
    }
  },
  isOriginal: (isOriginal: boolean) => {
    if (isOriginal === null) {
      return 'This field is required.';
    }
  },
  secAnswer: (secAnswer: string) => {
    if (secAnswer === '') {
      return 'This field is required.';
    }
  }
};


export default function ContributePack() {
  const [hasBeenSubmitted, setHasBeenSubmitted] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);
  const [securityId, setSecurityId] = React.useState('');
  const [securityQuestion, setSecurityQuestion] = React.useState('');
  const [tagArray, setTagArray] = React.useState<string[]>([]);


  /**
   * Get a security question
   */
  const fetchSecurityQuestion = React.useCallback(async () => {
    try {
      const q = await getSecurityQuestion();
      setSecurityQuestion(q.security_question);
      setSecurityId(q.security_id);
    } catch (err) {
      console.error('[Contribute] Unable to fetch security question', err);
    }
  }, []);


  /**
   * Get a security question at loading
   */
  React.useEffect(() => {
    setTimeout(() => {
      void fetchSecurityQuestion();
    }, 3000); // Delaying the query helps reducing the load
  }, [fetchSecurityQuestion]);


  /**
   * Sets 'hasBeenSubmitted' when the Submit button is clicked. We need this
   * because Formik will not call our onSubmit function when the submit button
   * is clicked _but_ validation fails. This makes sense, but because we want to
   * change the way validation errors are presented to the user after the first
   * submit attempt, we need to track "attempts" separately.
   */
  const onSubmitClick = React.useCallback(() => {
    setHasBeenSubmitted(true);
  }, [
    setHasBeenSubmitted
  ]);

  /**
   * Reset the form to its original state
   */
  // @ts-expect-error
  const handleReset = React.useCallback(({ resetForm }) => {
    void fetchSecurityQuestion();
    resetForm();
    setRequestSent(false);
    setTagArray([]);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [
    fetchSecurityQuestion,
    requestSent
  ]);


  /**
   * Called when the form is submitted and has passed validation.
   */
  // @ts-expect-error
  const onSubmit = React.useCallback(async (values: FormValues, { setErrors }) => {
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(values.signalArtUrl);
    if (!matches) {
      throw new Error('Unable to extract pack ID and pack key from signal.art URL.');
    }

    const [, packId, packKey] = matches;

    const tags = R.uniq(tagArray
      .map(tag => tag.trim())
      .filter(tag => tag.length));

    const payload: ContributePayload = {
      pack: {
        id: packId,
        key: packKey,
        source: values.source,
        tags,
        nsfw: values.isNsfw === 'true',
        original: values.isOriginal === 'true'
      },
      submitter_comments: values.submitterComments,
      security_id: securityId,
      security_answer: values.secAnswer
    };

    try {
      await contributePack(payload);
      setRequestSent(true);
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.type) {
          case 'wrong_answer':
            setErrors({ secAnswer: err.msg });
            break;
          case 'security_verification_failed':
            setErrors({ secAnswer: err.msg });
            void fetchSecurityQuestion(); // the old question is invalid/expired
            break;
          case 'duplicate_pack':
            setErrors({ signalArtUrl: err.msg });
            break;
          case 'pack_invalid':
            setErrors({ signalArtUrl: err.msg });
            break;
          default:
            // Field-level errors (e.g. 422 validation errors): display the
            // message on the field the error refers to, when we know it.
            switch (errorFieldPath(err)) {
              case 'pack.id':
              case 'pack.key':
                setErrors({ signalArtUrl: err.msg });
                break;
              case 'pack.source':
                setErrors({ source: err.msg });
                break;
              case 'pack.tags':
                setErrors({ tags: err.msg });
                break;
              case 'pack.nsfw':
                setErrors({ isNsfw: err.msg });
                break;
              case 'pack.original':
                setErrors({ isOriginal: err.msg });
                break;
              case 'security_answer':
                setErrors({ secAnswer: err.msg });
                break;
              case 'submitter_comments':
                setErrors({ submitterComments: err.msg });
                break;
              default:
                setErrors({ secAnswer: err.msg || 'Something went wrong. Please try again.' });
            }
        }
      } else {
        setErrors({ secAnswer: 'Something went wrong. Please try again.' });
      }
    }
  }, [fetchSecurityQuestion, securityId, tagArray]);


  // ----- Render --------------------------------------------------------------


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
      Signalstickers' Contribution Guidelines
    </ExternalLink>
  ), []);

  return (
    <div className="my-4 p-lg-3 px-lg-4">
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
              Fill this form. Please check that your pack is not already listed on the website.
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
            initialValues={initialValues}
            onSubmit={(values, { setErrors }) => onSubmit(values, { setErrors })}
            validateOnChange={hasBeenSubmitted}
            validateOnBlur={hasBeenSubmitted}
          >
            {({ errors, isValidating, isSubmitting, resetForm, values }) => (
              <Form noValidate>
                {/* [Field] Signal.art Url */}
                <div className="form-group">
                  <div className="form-row">
                    <label className={cx('col-12', errors.signalArtUrl && 'text-danger')} htmlFor="signal-art-url">
                      Signal.art URL:
                      <Field
                        type="text"
                        id="signal-art-url"
                        name="signalArtUrl"
                        validate={validators.signalArtUrl}
                        className={cx('form-control', 'mt-2', errors.signalArtUrl && 'is-invalid')}
                        disabled={requestSent}
                        placeholder="https://signal.art/addstickers/#pack_id=<your pack id>&pack_key=<your pack key>"
                      />
                      <div>
                        <ErrorMessage name="signalArtUrl" />&nbsp;
                      </div>
                      <PackPreviewCard url={values.signalArtUrl} />
                    </label>
                  </div>
                </div>

                {/* [Field] Source */}
                <div className="form-group">
                  <div className="form-row">
                    <label className={cx('col-12', errors.source && 'text-danger')} htmlFor="source">
                      (Optional) Source:
                      <Field
                        type="text"
                        id="source"
                        name="source"
                        validate={validators.source}
                        className={cx('form-control', 'mt-2', errors.source && 'is-invalid')}
                        disabled={requestSent}
                      />
                      <small className="form-text text-muted">Original author, website, company, etc.</small>
                      <div>
                        <ErrorMessage name="source" />&nbsp;
                      </div>
                    </label>
                  </div>
                </div>

                {/* [Field] Tags */}
                <div className="form-group mb-4">
                  <div className="form-row">
                    <label className={cx('col-12', errors.tags && 'text-danger')} htmlFor="tags">
                      (Optional) Tags:
                      <TagInput
                        name="tags"
                        tags={tagArray}
                        onTagsChange={setTagArray}
                        maxTags={MAX_TAGS}
                        disabled={requestSent}
                        error={!!errors.tags}
                      />
                      <small className="form-text text-muted">Type and press Enter to add a tag. Backspace to edit last tag. Click a tag to remove it.</small>
                      {tagArray.length >= MAX_TAGS &&
                        <small className="form-text text-danger">Maximum of {MAX_TAGS} tags reached.</small>
                      }
                      {tagArray.some(tag => tag.toLowerCase() === 'furry') && (
                        <p className="form-text text-danger"><span className="font-weight-bold"><u>IMPORTANT</u></span>: our furry review guidelines have changed. Furry packs that contain <span className="font-weight-bold">graphic/sexual content will now be rejected.</span><br/><br/>
                        Moreover, <span className="font-weight-bold">we will remove the already submitted packs that contain graphic/sexual content in a few weeks/months.</span><br/><br/>
                        If you are the person who contributes to a lot of these packs, please include a way to contact you (<code>signal.me</code> link, email address, Telegram, ...) in the Comments field, so we can discuss how you can archive the content before we remove it.
                        </p>

                      )}
                      <div>
                        <ErrorMessage name="tags" />&nbsp;
                      </div>
                    </label>
                  </div>
                </div>

                {/* [Field] NSFW */}
                <div className="form-group">
                  <div className="form-row">
                    <legend className={cx('col-12', 'mb-2', 'fs-1', errors.isNsfw && 'text-danger')}>
                      Is your sticker pack <ExternalLink href="https://www.urbandictionary.com/define.php?term=NSFW" title="NSFW">NSFW</ExternalLink>?
                    </legend>
                  </div>
                  <div className="form-row">
                    <div className="col-12 mb-1">
                      <div className="custom-control custom-radio">
                        <Field
                          type="radio"
                          id="is-nsfw-true"
                          name="isNsfw"
                          validate={validators.isNsfw}
                          className={cx('custom-control-input', errors.isNsfw && 'is-invalid')}
                          value="true"
                          disabled={requestSent}
                        />
                        <label className="custom-control-label" htmlFor="is-nsfw-true">
                          Yes
                        </label>
                      </div>
                    </div>
                    <div className="col-12 mb-1">
                      <div className="custom-control custom-radio">
                        <Field
                          type="radio"
                          id="is-nsfw-false"
                          name="isNsfw"
                          validate={validators.isNsfw}
                          className={cx('custom-control-input', errors.isNsfw && 'is-invalid')}
                          value="false"
                          disabled={requestSent}
                        />
                        <label className="custom-control-label" htmlFor="is-nsfw-false">No</label>
                      </div>
                      <div>
                        <ErrorMessage name="isNsfw" />&nbsp;
                      </div>
                    </div>
                  </div>
                </div>

                {/* [Field] Original */}
                <div className="form-group">
                  <div className="form-row">
                    <legend className={cx('col-12', 'mb-2', 'fs-6', errors.isOriginal && 'text-danger')}>
                      Is your pack original? Did the author of the pack draw it exclusively for Signal, from original artworks?
                    </legend>
                  </div>
                  <div className="form-row">
                    <div className="col-12 mb-1">
                      <div className="custom-control custom-radio">
                        <Field
                          type="radio"
                          id="is-original-true"
                          name="isOriginal"
                          validate={validators.isOriginal}
                          className={cx('custom-control-input', errors.isOriginal && 'is-invalid')}
                          value="true"
                          disabled={requestSent}
                        />
                        <label className="custom-control-label" htmlFor="is-original-true">
                          Yes
                        </label>
                      </div>
                    </div>
                    <div className="col-12 mb-1">
                      <div className="custom-control custom-radio">
                        <Field
                          type="radio"
                          id="is-original-false"
                          name="isOriginal"
                          validate={validators.isOriginal}
                          className={cx('custom-control-input', errors.isOriginal && 'is-invalid')}
                          value="false"
                          disabled={requestSent}
                        />
                        <label className="custom-control-label" htmlFor="is-original-false">No</label>
                      </div>
                      <div>
                        <ErrorMessage name="isOriginal" />&nbsp;
                      </div>
                    </div>
                  </div>
                </div>

                {/* [Field] Security Answer */}
                <div className="form-group">
                  <div className="form-row">
                    <label className={cx('col-12', errors.secAnswer && 'text-danger')} htmlFor="secAnswer">
                      {securityQuestion}
                      <Field
                        type="text"
                        id="secAnswer"
                        name="secAnswer"
                        validate={validators.secAnswer}
                        className={cx('form-control', 'mt-2', errors.secAnswer && 'is-invalid')}
                        disabled={requestSent}
                      />
                      <small className="form-text text-muted">This question helps us to make sure that you are not a robot. The answer is a single word or number, without quotes.</small>
                      <div>
                        <ErrorMessage name="secAnswer" />&nbsp;
                      </div>
                    </label>
                  </div>
                </div>

                {/* [Field] Submitter comments */}
                <div className="form-group">
                  <div className="form-row">
                    <label className="col-12" htmlFor="submitterComments">
                      (Optional) Any comments?
                      <Field
                        as="textarea"
                        type="textarea"
                        id="submitterComments"
                        name="submitterComments"
                        className="form-control mt-2"
                        disabled={requestSent}
                        maxLength="400"
                      />
                      <small className="form-text text-muted">This will only be visible to moderators. Do not enter personal information. Or just say hello, we love it :-)</small>
                    </label>
                  </div>
                </div>

                {/* [Control] Submit and Reset */}
                <div className="form-group">
                  <div className="form-row">
                    <div className="col-12">
                      <button
                        type="submit"
                        className={`btn btn-block btn-lg ${requestSent ? 'btn-success' : 'btn-primary '}`}
                        disabled={isSubmitting || isValidating || requestSent}
                        onClick={onSubmitClick}
                      >
                        {requestSent
                          ? <span>Request sent, thanks!</span>
                          : <span>Propose to signalstickers.org</span>
                        }
                        {isSubmitting}
                      </button>
                      {requestSent ?
                        <button
                          type="reset"
                          className="btn btn-block btn-lg btn-primary"
                          onClick={() => handleReset({ resetForm })}
                        >
                          Propose another pack
                        </button>
                      : ''
                      }

                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
