import cx from 'classnames';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  type FieldValidator,
  type FormikHelpers
} from 'formik';
import React from 'react';
import { Link } from 'react-router-dom';

import { SIGNAL_ART_URL_PATTERN, API_URL_STATUS } from 'etc/constants';

/**
 * Test pack:
 * https://signal.art/addstickers/#pack_id=b2e52b07dfb0af614436508c51aa24eb&pack_key=66224990b3e956ad4a735830df8cd071275afeae79db9797e57d99314daffc77
 */


interface FormValues {
  signalArtUrl: string;
}


interface PackStatusResponse {
  pack_id: string;
  pack_title: string;
  status: 'ONLINE' | 'IN_REVIEW' | 'REFUSED';
  status_comments: string;
  error?: string;
}


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


export default function ContributionStatus() {
  const [packStatus, setPackStatus] = React.useState<PackStatusResponse>();


  /**
   * Called when the form is submitted _after_ it has passed validation.
   */
  const onSubmit = React.useCallback(async (values: FormValues, { setStatus }: FormikHelpers<FormValues>) => {
    // Extract pack ID and key from provided signal.art URL.
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(values.signalArtUrl);
    if (!matches) throw new Error('Unable to extract pack ID and pack key from signal.art URL.');
    const [, packId, packKey] = matches;

    const response = await fetch(API_URL_STATUS, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pack_id: packId,
        pack_key: packKey
      })
    });

    const packStatus: PackStatusResponse = await response.json();

    if (response.status !== 200) {
      setStatus({
        state: 'error',
        error: packStatus.error ?? 'An unknown error occurred.'
      });

      return;
    }

    setStatus({ state: 'success' });
    setPackStatus(packStatus);
  }, [packStatus]);


  const packStatusDescription = React.useMemo(() => {
    if (!packStatus) return;

    if (packStatus.status === 'ONLINE') return (
      <>
        <p>
          Your pack <strong>{packStatus?.pack_title}</strong> is <strong>published</strong>!
        </p>
        <p>
          You can view it <Link to={`/pack/${packStatus.pack_id}`}>here</Link>.
        </p>
      </>
    );

    if (packStatus.status === 'IN_REVIEW') return (
      <p>
        Your pack <strong>{packStatus?.pack_title}</strong> is <strong>still in review</strong>.
      </p>
    );

    if (packStatus.status === 'REFUSED') return (
      <>
        <p>
          Your pack <strong>{packStatus?.pack_title}</strong> has <strong>not been published</strong>.
        </p>
        {packStatus.status_comments && (
          <p>
            Moderator comments: <em>{packStatus.status_comments}</em>
          </p>
        )}
      </>
    );
  }, [packStatus]);


  return (
    <div className="my-4 p-lg-3 px-lg-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Contribution Status</h1>
          <p className="mt-lg-3 mb-4">
            If you proposed a pack via the Contribute page, you can use this form to check the status of your contribution!
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
          >
            {({ status, errors, isValidating, isSubmitting }) => (
              <Form noValidate>

                {/* [Field] Signal.art URL */}
                <div className="mb-3">
                  <label
                    className="fs-5 mb-1"
                    htmlFor="signal-art-url"
                  >
                    Signal.art URL:
                  </label>
                  <div className="input-group">
                    <Field
                      type="text"
                      id="signal-art-url"
                      name="signalArtUrl"
                      validate={validators.signalArtUrl}
                      className={cx(
                        'form-control form-control-lg bg-transparent',
                        errors.signalArtUrl && 'is-invalid'
                      )}
                      placeholder="https://signal.art/addstickers/#pack_id=<packId>&pack_key=<packKey>"
                      aria-describedby="signal-art-url-error"
                    />
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary"
                      disabled={isSubmitting || isValidating}
                    >
                      Submit
                    </button>
                  </div>
                  <div
                    id="signal-art-url-error"
                    className={cx('d-block', errors.signalArtUrl && 'invalid-feedback')}
                  >
                    <ErrorMessage name="signalArtUrl" />&nbsp;
                  </div>
                </div>

                {/* Global Form Status / Errors */}
                <div className="fs-5 mb-3">
                  {status.state === 'success'
                    ? packStatusDescription
                    : status.state === 'error' ? (
                      <span><b>Oops!</b> {status.error}</span>
                    ) : (
                      <span>&nbsp;</span>
                    )
                  }
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
