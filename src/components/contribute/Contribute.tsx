import {Formik, Form, Field, ErrorMessage} from 'formik';
import {cx} from 'linaria';
import {styled} from 'linaria/react';
import {darken} from 'polished';
import * as R from 'ramda';
import React, {useState, useRef} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import yamlLanguage from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import syntaxTheme from 'react-syntax-highlighter/dist/esm/styles/prism/base16-ateliersulphurpool.light';
import yaml from 'js-yaml';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import {GRAY} from 'etc/colors';
import {getStickerPackDirectory, getStickerPack} from 'lib/stickers';
import {bp} from 'lib/utils';


/**
 * Test pack:
 * https://signal.art/addstickers/#pack_id=b2e52b07dfb0af614436508c51aa24eb&pack_key=66224990b3e956ad4a735830df8cd071275afeae79db9797e57d99314daffc77
 */


// ----- Styles ----------------------------------------------------------------

const Contribute = styled.div`
  background-color: white;

  @media ${bp('lg')} {
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

  & legend {
    font-size: 1em;
  }

  & pre[class*="language-"] {
    margin: 0;
  }
`;


// ----- Types -----------------------------------------------------------------

export interface FormValues {
  signalArtUrl: string;
  source: string;
  tags: string;
  isNsfw?: 'true' | 'false';
  isOriginal?: 'true' | 'false';
}


// ----- Locals ----------------------------------------------------------------

/**
 * Regular expression used to validate signal.art URLs for sticker packs.
 */
const SIGNAL_ART_URL_PATTERN = /^https:\/\/signal.art\/addstickers\/#pack_id=([\dA-Za-z]+)&pack_key=([\dA-Za-z]+)$/g;

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
  isNsfw: undefined,
  isOriginal: undefined
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
    if (isNsfw === undefined) {
      return 'This field is required.';
    }
  },
  isOriginal: (isOriginal?: boolean) => {
    if (isOriginal === undefined) {
      return 'This field is required.';
    }
  }
};


// ----- Component -------------------------------------------------------------

SyntaxHighlighter.registerLanguage('yaml', yamlLanguage);

const ContributeComponent: React.FunctionComponent = () => {
  const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);
  const [ymlBlob, setYmlBlob] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const openPrButton = useRef<HTMLAnchorElement>(null);


  /**
   * Sets 'hasBeenSubmitted' when the Submit button is clicked. We need this
   * because Formik will not call our onSubmit function when the submit button
   * is clicked _but_ validation fails. This makes sense, but because we want to
   * change the way validation errors are presented to the user after the first
   * submit attempt, we need to track "attempts" separately.
   */
  const onSubmitClick = () => {
    setHasBeenSubmitted(true);
    setYmlBlob('');
    setPreviewUrl('');
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

    const tags = R.uniq(values.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length));

    setYmlBlob(yaml.safeDump({
      [packId]: {
        key: packKey,
        source: values.source,
        tags,
        nsfw: values.isNsfw === 'true' ? true : false,
        original: values.isOriginal === 'true' ? true : false
      }
    }, {
      indent: 2
    }).trim());

    setPreviewUrl(
      `https://signalstickers.com/pack/${packId}?key=${packKey}`
    );

    if (openPrButton.current) {
      openPrButton.current.scrollIntoView({behavior: 'smooth'});
    }

    return true;
  };


  // ----- Render --------------------------------------------------------------

  return (
    <Contribute className="my-4 p-lg-3 px-lg-4">
      <div className="row">
        <div className="col-12">
          <p className="mt-lg-3 mb-4">
            Getting your sticker pack listed in the Signal Stickers directory is
            easy! First, paste the <code>signal.art</code> link for your sticker
            pack, including the <code>pack_id</code> and <code>pack_key</code> values,
            into the form below. Then, answer a few questions about your sticker
            pack and add optional metadata.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-10 offset-md-1">
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
                  <legend className={cx('col-12', 'mb-2', errors.isNsfw && 'text-danger')}>
                    Is your sticker pack <a href="https://www.urbandictionary.com/define.php?term=NSFW" target="_blank" rel="noreferrer">NSFW</a>?
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
                        checked={values.isNsfw === 'true'}
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

              {/* [Field] Original */}
              <div className="form-group">
                <div className="form-row">
                  <legend className={cx('col-12', 'mb-2', errors.isOriginal && 'text-danger')}>
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
                        checked={values.isOriginal === 'true'}
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
                        checked={values.isOriginal === 'false'}
                      />
                      <label className="custom-control-label" htmlFor="is-original-false">No</label>
                    </div>
                    <div className="invalid-feedback">
                      <ErrorMessage name="isOriginal" />&nbsp;
                    </div>
                  </div>
                </div>
              </div>

              {/* [Control] Submit */}
              <div className="form-group">
                <div className="form-row">
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting || isValidating} onClick={onSubmitClick}>
                      Generate YML
                    </button>
                  </div>
                </div>
              </div>

            </Form>
          )}
          </Formik>
        </div>
      </div>

      {/* Rendered YML Output */}
      {ymlBlob ?
        <>
          <div className="row">
            <div className="col-12">
              <hr />
              <p className="mt-4 mb-4">
                Great! Below is the YML blob you will need to add at the end of
                <code>stickers.yml</code> in the <a href="https://github.com/signalstickers/signalstickers/edit/master/stickers.yml" target="_blank" rel="noreferrer">Signal Stickers repository</a>.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1">
              <div className="card">
                <SyntaxHighlighter
                  language="yaml"
                  style={syntaxTheme}
                  customStyle={{margin: '0'}}
                >
                  {ymlBlob}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <p className="mt-4 mb-4">
                Please also include this link in your Pull Request description,
                as it allows us to review your pack easily!
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1">
              <div className="card mb-3">
                <SyntaxHighlighter
                  language="yaml"
                  style={syntaxTheme}
                  customStyle={{margin: '0'}}
                >
                  {previewUrl}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1">
              <a
                ref={openPrButton}
                className="btn btn-success btn-block"
                href="https://github.com/signalstickers/signalstickers/edit/master/stickers.yml"
                target="_blank"
                rel="noreferrer"
                title="Open a Pull Request"
              >
                <Octicon name="link-external" /> Edit the file and open a Pull Request
              </a>
            </div>
          </div>
        </>
        : null}
    </Contribute>
  );
};


export default ContributeComponent;
