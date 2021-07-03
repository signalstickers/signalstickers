import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldValidator
} from 'formik';
import { cx } from 'linaria';
import { styled } from 'linaria/react';
import React from 'react';
import { Link } from 'react-router-dom';
import { SIGNAL_ART_URL_PATTERN, API_URL_STATUS } from 'etc/constants';


/**
 * Test pack:
 * https://signal.art/addstickers/#pack_id=b2e52b07dfb0af614436508c51aa24eb&pack_key=66224990b3e956ad4a735830df8cd071275afeae79db9797e57d99314daffc77
 */


// ----- Styles ----------------------------------------------------------------

const ContributionStatus = styled.div`
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
}


// ----- Locals ----------------------------------------------------------------

/**
 * Initial values for the form.
 */
const initialValues: FormValues = {
  signalArtUrl: ''
};

/**
 * Validators for each field in our form.
 */
const validators: Record<string, FieldValidator> = {
  signalArtUrl: (signalArtUrl: string) => {
    if (!signalArtUrl) {
      return 'This field is required.';
    }

    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(signalArtUrl);
    if (!matches) {
      return 'Invalid signal.art URL.';
    }
  }
};


// ----- Component -------------------------------------------------------------

const ContributionStatusComponent: React.FunctionComponent = () => {
  const [packInfo, setPackInfo] = React.useState({
    error: '',
    pack_id: '',
    pack_title: '',
    status: '',
    status_comments: ''
  }
  );


  /**
   * Called when the form is submitted and has passed validation.
   */
  const onSubmit = React.useCallback((values: FormValues, { setSubmitting }) => {
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(values.signalArtUrl);
    if (!matches) {
      throw new Error('Unable to extract pack ID and pack key from signal.art URL.');
    }

    const [, packId, packKey] = matches;

    void fetch(API_URL_STATUS, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pack_id: packId,
        pack_key: packKey
      })
    }).then(async response =>
      response.json().then(data => ({
        data: data,
        status: response.status
      })
      ).then(res => {
        setPackInfo(res.data);
        setSubmitting(false);
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }));
  }, [packInfo]);


  // ----- Render --------------------------------------------------------------

  return (
    <ContributionStatus className="my-4 p-lg-3 px-lg-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Contribution status</h1>
          <p className="mt-lg-3 mb-4">
            If you proposed a pack via the Contribute page, you can use this form to check the status of your contribution!
          </p>
        </div>
      </div>
      <hr className="pt-3 pb-2" />

      { packInfo.error &&
        <div className="row">
          <div className="col-12">
            <p className="mt-lg-3 mb-4">
              <b>Oops!</b> {packInfo.error}
            </p>
          </div>
        </div>
      }

      { packInfo.status &&
        <div className="row">
          <div className="col-12">
            <p className="mt-lg-3 mb-4">

              Your pack <b>{packInfo.pack_title}</b>
              {packInfo.status === 'ONLINE' &&
                <> is <b>published</b>! <Link to={`/pack/${packInfo.pack_id}`}>Check it here.</Link></>
              }

              {packInfo.status === 'IN_REVIEW' &&
                <> is <b>still in review</b>! Real humans will soon check it.</>
              }

              {packInfo.status === 'REFUSED' &&
                <> has <b>not been published</b>.</>
              }
              {packInfo.status_comments &&
                <> Moderators left a comment: <em>{packInfo.status_comments}</em></>
              }

            </p>
          </div>
        </div>
      }

      <div className="row">
        <div className="col-12 col-md-10 offset-md-1">
          <Formik
            initialValues={initialValues}
            onSubmit={(values, { setErrors, setSubmitting }) => onSubmit(values, { setErrors, setSubmitting })}
          >{({ errors, isValidating, isSubmitting }) => (
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

              {/* [Control] Submit*/}
              <div className="form-group">
                <div className="form-row">
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-block btn-lg btn-primary"
                      disabled={isSubmitting || isValidating}
                    >
                      {isSubmitting ?
                        <span>Checking...</span>
                        : <span>Check status</span>
                      }
                      {isSubmitting}
                    </button>
                  </div>
                </div>
              </div>

            </Form>
          )}
          </Formik>
        </div>
      </div>
    </ContributionStatus>
  );
};


export default ContributionStatusComponent;
