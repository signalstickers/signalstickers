import {Formik, Form, Field, ErrorMessage} from 'formik';
import {cx} from 'linaria';
import {styled} from 'linaria/react';
import {darken} from 'polished';
import React, {useState} from 'react';
import * as R from 'ramda';

import {GRAY} from 'etc/colors';
import {getStickerPackList, getStickerPack} from 'lib/stickers';

/**
 * Test URL:
 * https://signal.art/addstickers/#pack_id=f36f5fb3d8dde697e1527650ea1c12a6&pack_key=eb6be23a93685d18568292818f6a4ebd85161b8ae1edca86a06698c1472200f0
 */


// ----- Styles ----------------------------------------------------------------

const Contribute = styled.div`
  background-color: white;

  @media screen and (min-width: 576px) {
    border-radius: 4px;
    border: 1px solid ${darken(0.15, GRAY)};
  }

  /**
   * Ensures error feedback containers are always visible (even if empty) so
   * that controls do not jump around as they move between valid and invalid
   * states.
   */
  & .invalid-feedback {
    display: block;
  }
`;


// ----- Types -----------------------------------------------------------------

export interface FormValues {
  signalArtUrl: string;
  source: string;
  tags: string;
  isNsfw?: 'true' | 'false';
}


// ----- Locals ----------------------------------------------------------------

/**
 * Regular expression used to validate signal.art URLs for sticker packs.
 */
const SIGNAL_ART_URL_PATTERN = /^https:\/\/signal.art\/addstickers\/#pack_id=([A-Za-z0-9]+)&pack_key=([A-Za-z0-9]+)$/g;

/**
 * Regular expression used to validate lists of tags.
 */
const TAGS_PATTERN = /^(?:([\w\d-_ ]+))+(?:, ([\w\d-_ ]+))*$/g;

/**
 * Initial values for the form.
 */
const initialValues: FormValues = {
  signalArtUrl: '',
  source: '',
  tags: '',
  isNsfw: undefined
};

/**
 * Validators for each field in our form.
 */
const validators = {
  signalArtUrl: async (signalArtUrl: string) => {
    if (!signalArtUrl) {
      return 'This field is required.';
    }

    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(signalArtUrl);

    if (!matches) {
      return 'Invalid signal.art URL.';
    }

    const [, packId, packKey] = matches;

    if (R.find(R.compose(R.propEq('id', packId), R.prop('meta')), await getStickerPackList())) {
      return 'A sticker pack with that ID already exists in the directory.';
    }

    try {
      await getStickerPack(packId, packKey);
    } catch (err) {
      return 'Invalid sticker pack. Please check the pack ID and key.';
    }
  },
  source: (source: string) => {
    if (source && source.length > 320) {
      return 'This field must be no longer than 320 characters.';
    }
  },
  tags: (tags: string) => {
    if (tags !== '' && !(new RegExp(TAGS_PATTERN).test(tags))) {
      return 'Invalid value. Tags must be a list of comma-delimited strings.';
    }
  },
  isNsfw: (isNsfw?: boolean) => {
    if (isNsfw === undefined) {
      return 'This field is required.';
    }
  }
};


// ----- Component -------------------------------------------------------------

const ContributeComponent: React.FunctionComponent = () => {
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
  const [jsonBlob, setJsonBlob] = useState('');


  /**
   * Sets 'hasBeenSubmitted' when the Submit button is clicked. We need this
   * because Formik will not call our onSubmit function when the submit button
   * is clicked _but_ validation fails. This makes sense, but because we want to
   * change the way validation errors are presented to the user after the first
   * submit attempt, we need to track "attempts" separately.
   */
  const onSubmitClick = () => {
    setHasBeenSubmitted(true);
    setJsonBlob('');
  };


  /**
   * Called when the form is submitted and has passed validation.
   */
  const onSubmit: any = (values: FormValues) => {
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(values.signalArtUrl);

    if (!matches) {
      throw new Error('Unable to extract pack ID and pack key from signal.art URL.');
    }

    const [, packId, packKey] = matches;

    setJsonBlob(JSON.stringify({
      [packId]: {
        key: packKey,
        source: values.source,
        tags: values.tags,
        nsfw: values.isNsfw === 'true' ? true : false
      }
    }, null, 2).trim());

    return true;
  };


  // ----- Render --------------------------------------------------------------

  return (
    <Contribute className="px-1 px-md-4 py-4 mt-0 mt-md-5 mb-5">
      <div className="row">
        <div className="col-12">
          <p>
            Getting your sticker pack listed in the Signal Stickers directory is
            easy! First, paste the <code>signal.art</code> link for your sticker
            pack, including the <code>pack_id</code> and <code>pack_key</code> values,
            into the form below. Then, answer a few questions about your sticker
            pack and add optional metadata.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-8 offset-md-2 mt-4">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnChange={hasBeenSubmitted}
            validateOnBlur={hasBeenSubmitted}
          >{({values, errors, isValidating, isSubmitting}) => (
            <Form noValidate>

              {/* [Field] Signal Art Url */}
              <div className="form-group">
                <div className="form-row">
                  <label className={cx('col-12', errors.signalArtUrl && 'text-danger')} htmlFor="signal-art-url">
                    Signal Art URL:
                    <Field
                      type="text"
                      id="signal-art-url"
                      name="signalArtUrl"
                      validate={validators.signalArtUrl}
                      className={cx('form-control', errors.signalArtUrl && 'is-invalid')}
                      placeholder="https://signal.art/addstickers/#pack_id=<your pack id>&pack_key=<your pack key>"
                    />
                    <div className="invalid-feedback">
                      <ErrorMessage name="signalArtUrl" />&nbsp;
                    </div>
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
                      className={cx('form-control', errors.source && 'is-invalid')}
                    />
                    <small className="form-text text-muted">Original author, website, company, etc.</small>
                    <div className="invalid-feedback">
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
                    <Field
                      type="text"
                      id="tags"
                      name="tags"
                      validate={validators.tags}
                      className={cx('form-control', errors.tags && 'is-invalid')}
                    />
                    <small className="form-text text-muted">Comma-separated list of words.</small>
                    <div className="invalid-feedback">
                      <ErrorMessage name="tags" />&nbsp;
                    </div>
                  </label>
                </div>
              </div>

              {/* [Field] NSFW */}
              <div className="form-group">
                <div className="form-row">
                  <label className={cx('col-12', 'mb-2', errors.isNsfw && 'text-danger')}>
                    Is your sticker pack <a href="https://www.urbandictionary.com/define.php?term=NSFW" target="_blank" rel="noreferrer">NSFW</a>?
                  </label>
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
                        checked={values.isNsfw === 'true'}
                      />
                      <label className="custom-control-label" htmlFor="is-nsfw-true">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="custom-control custom-radio">
                      <Field
                        type="radio"
                        id="is-nsfw-false"
                        name="isNsfw"
                        validate={validators.isNsfw}
                        className={cx('custom-control-input', errors.isNsfw && 'is-invalid')}
                        value="false"
                        checked={values.isNsfw === 'false'}
                      />
                      <label className="custom-control-label" htmlFor="is-nsfw-false">No</label>
                    </div>
                    <div className="invalid-feedback">
                      <ErrorMessage name="isNsfw" />&nbsp;
                    </div>
                  </div>
                </div>
              </div>

              {/* [Control] Submit */}
              <div className="form-group">
                <div className="form-row">
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || isValidating} onClick={onSubmitClick}>
                      Generate JSON
                    </button>
                  </div>
                </div>
              </div>

            </Form>
          )}
          </Formik>
        </div>
      </div>

      {/* Rendered JSON Output */}
      {jsonBlob ?
      <>
        <div className="row">
          <div className="col-12">
            <hr />
            <p className="mt-4 mb-4">
              Great! Below is the JSON blob you will need to add to <code>stickers.json</code> in the <a href="https://github.com/romainricard/signalstickers/edit/master/stickers.json">Signal Stickers repository</a>.
            </p>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1">
            <div className="card">
              <pre>{jsonBlob}</pre>
            </div>
          </div>
        </div>
      </>
      : null}
    </Contribute>
  );
};


export default ContributeComponent;
