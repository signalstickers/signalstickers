import { Formik, Form, Field, ErrorMessage, FieldValidator } from 'formik';
import { cx } from 'linaria';
import { styled } from 'linaria/react';
import * as R from 'ramda';
import React from 'react';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
import yamlLanguage from 'react-syntax-highlighter/dist/esm/languages/prism/yaml';
import syntaxTheme from 'react-syntax-highlighter/dist/esm/styles/prism/base16-ateliersulphurpool.light';
import yaml from 'js-yaml';

import ExternalLink from 'components/general/ExternalLink';
import { getStickerPackDirectory, getStickerPack } from 'lib/stickers';


/**
 * Test pack:
 * https://signal.art/addstickers/#pack_id=b2e52b07dfb0af614436508c51aa24eb&pack_key=66224990b3e956ad4a735830df8cd071275afeae79db9797e57d99314daffc77
 */


// ----- Styles ----------------------------------------------------------------

const Contribute = styled.div`
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
  isAnimated?: 'true' | 'false';
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
  isOriginal: undefined,
  isAnimated: undefined
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
  },
  isAnimated: (isAnimated?: boolean) => {
    if (isAnimated === undefined) {
      return 'This field is required.';
    }
  }
};


// ----- Component -------------------------------------------------------------

SyntaxHighlighter.registerLanguage('yaml', yamlLanguage);

const ContributeComponent: React.FunctionComponent = () => {
  const [hasBeenSubmitted, setHasBeenSubmitted] = React.useState(false);
  const [ymlBlob, setYmlBlob] = React.useState('');
  const openPrButton = React.useRef<HTMLAnchorElement>(null);


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
        original: values.isOriginal === 'true' ? true : false,
        animated: values.isAnimated === 'true' ? true : false
      }
    }, {
      indent: 2
    }).trim());

    if (openPrButton.current) {
      openPrButton.current.scrollIntoView({ behavior: 'smooth' });
    }

    return true;
  };


  // ----- Render --------------------------------------------------------------

  const gitHubLink = React.useMemo(() => (
    <ExternalLink
      href="https://github.com"
      title="GitHub"
    >
      GitHub
    </ExternalLink>
  ), []);

  const pullRequestLink = React.useMemo(() => (
    <ExternalLink
      href="https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests"
      title="Pull Request"
    >
      Pull Request
    </ExternalLink>
  ), []);

  const stickerPackGuideLink = React.useMemo(() => (
    <ExternalLink
      href="https://support.signal.org/hc/articles/360031836512-Stickers#h_c2a0a45b-862f-4d12-9ab1-d9a6844062ca"
      title="Sticker Creator Guidelines"
    >
      Sticker Creator Guidelines
    </ExternalLink>
  ), []);

  const yamlLink = React.useMemo(() => (
    <ExternalLink
      href="https://en.wikipedia.org/wiki/YAML"
      title="YAML"
    >
      YAML
    </ExternalLink>
  ), []);

  const editStickersYmlLink = React.useMemo(() => (
    <ExternalLink
      href="https://github.com/signalstickers/signalstickers/edit/master/stickers.yml"
      title="Signal Stickers repository"
    >
      Signal Stickers repository
    </ExternalLink>
  ), []);

  const twitterLink = React.useMemo(() => (
    <ExternalLink
      href="https://twitter.com/signalstickers"
      title="Twitter"
    >
      @signalstickers
    </ExternalLink>
  ), []);

  return (
    <Contribute className="my-4 p-lg-3 px-lg-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Contribute</h1>
          <p className="mt-lg-3 mb-4">
            To get your sticker pack listed in the Signal Stickers directory:
          </p>
          <ol>
            <li className="mb-2">
              If you don't already have one, create a {gitHubLink} account. You will need one in order
              to open a {pullRequestLink} against the Signal Stickers repository.
            </li>
            <li className="mb-2">
              Create a sticker pack using the Signal desktop app. For help, see Signal's {stickerPackGuideLink}.
              Be sure to save the <code>signal.art</code> URL for your pack. If you are creating a
              sticker pack derived from an existing one on another platform or from someone else's
              artwork, please consider using the original author's name in the <strong>Author</strong> field
              when creating your pack in Signal, and consider adding their website, Twitter handle, or
              other online presence to the <strong>Source</strong> field below.
            </li>
            <li className="mb-2">
              Open a Pull Request in the Signal Stickers GitHub repository updating <code>stickers.yml</code> to
              to include an entry for your sticker pack.
            </li>
          </ol>
          <p>
            The form below will guide you through the process of generating the {yamlLink} entry for
            your pack that you will need to add to <code>stickers.yml</code>.
          </p>
          <p>
            Alternatively, you can send us the YAML via a Twitter message at {twitterLink}.
            Please only use this if you have no way to open a Pull Request on GitHub!
          </p>
        </div>
      </div>
      <hr className="pt-3 pb-2" />
      <div className="row">
        <div className="col-12 col-md-10 offset-md-1">
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validateOnChange={hasBeenSubmitted}
            validateOnBlur={hasBeenSubmitted}
          >{({ values, errors, isValidating, isSubmitting }) => (
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
                      className={cx('form-control', 'mt-2', errors.source && 'is-invalid')}
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
                      className={cx('form-control', 'mt-2', errors.tags && 'is-invalid')}
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

              {/* [Field] Animated */}
              <div className="form-group">
                <div className="form-row">
                  <legend className={cx('col-12', 'mb-2', errors.isAnimated && 'text-danger')}>
                    Is your pack animated?
                  </legend>
                </div>
                <div className="form-row">
                  <div className="col-12 mb-1">
                    <div className="custom-control custom-radio">
                      <Field
                        type="radio"
                        id="is-animated-true"
                        name="isAnimated"
                        validate={validators.isAnimated}
                        className={cx('custom-control-input', errors.isAnimated && 'is-invalid')}
                        value="true"
                        checked={values.isAnimated === 'true'}
                      />
                      <label className="custom-control-label" htmlFor="is-animated-true">
                        Yes
                      </label>
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <div className="custom-control custom-radio">
                      <Field
                        type="radio"
                        id="is-animated-false"
                        name="isAnimated"
                        validate={validators.isAnimated}
                        className={cx('custom-control-input', errors.isAnimated && 'is-invalid')}
                        value="false"
                        checked={values.isAnimated === 'false'}
                      />
                      <label className="custom-control-label" htmlFor="is-animated-false">No</label>
                    </div>
                    <div className="invalid-feedback">
                      <ErrorMessage name="isAnimated" />&nbsp;
                    </div>
                  </div>
                </div>
              </div>

              {/* [Control] Submit */}
              <div className="form-group">
                <div className="form-row">
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-lg"
                      disabled={isSubmitting || isValidating}
                      onClick={onSubmitClick}
                    >
                      Generate YAML
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
                Great! Below is the YAML entry you will need to add to the end of <code>stickers.yml</code> in
                the {editStickersYmlLink}:
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-10 offset-md-1">
              <div className="card">
                <SyntaxHighlighter
                  language="yaml"
                  style={syntaxTheme}
                  customStyle={{ margin: '0' }}
                >
                  {ymlBlob}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-12 col-md-10 offset-md-1">
              <ExternalLink
                title="Open a Pull Request"
                href="https://github.com/signalstickers/signalstickers/edit/master/stickers.yml"
                className="btn btn-success btn-block btn-lg"
                ref={openPrButton}
              >
                Edit the file and open a Pull Request
                <BsBoxArrowUpRight className="ml-2" />
              </ExternalLink>
            </div>
          </div>
        </> :
        null
      }
    </Contribute>
  );
};


export default ContributeComponent;
