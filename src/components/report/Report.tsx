import cx from 'classnames';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldValidator,
  type FormikHelpers
} from 'formik';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import { API_URL_CONTRIBUTIONREQUEST, API_URL_REPORT } from 'etc/constants';
import { StickerPack } from 'etc/types';
import { getStickerPack } from 'lib/stickers';


export interface FormValues {
  secAnswer: string;
  submitterComments: string;
}


/**
 * URL parameters that we expect to have set when this component is rendered.
 */
export interface UrlParams {
  packId: string;
}


/**
 * Initial values for the form.
 */
const initialValues: FormValues = {
  secAnswer: '',
  submitterComments: ''
};


/**
 * Validators for each field in our form.
 */
const validators: Record<string, FieldValidator> = {
  secAnswer: (secAnswer: string) => {
    if (secAnswer === '') {
      return 'This field is required.';
    }
  },
  submitterComments: (submitterComments: string) => {
    if (submitterComments.length <= 30) {
      return 'Please give more details (min 30 chars).';
    }
  }
};


export default function ReportPack() {
  const [hasBeenSubmitted, setHasBeenSubmitted] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);
  const [reportRequestToken, setReportRequestToken] = React.useState('');
  const [reportRequestQuestion, setReportRequestQuestion] = React.useState('');
  const { packId } = useParams<UrlParams>();
  // StickerPack object for the requested pack.
  const [stickerPack, setStickerPack] = React.useState<StickerPack>();

  /**
   * [Effect] Set `stickerPack` when the component mounts.
   */
  useAsyncEffect(async () => {
    try {
      if (!packId) {
        return;
      }

      setStickerPack(await getStickerPack(packId));
    } catch {
      // TODO: Handle errors.
    }
  }, [packId]);

  /**
   * Get a ContributionRequest token and question
   */
  const fetchReportRequest = () => {
    void fetch(API_URL_CONTRIBUTIONREQUEST, { // We use the same URL API than the contribution request
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
      .then(async x => x.json())
      .then(x => {
        setReportRequestQuestion(x.contribution_question);
        setReportRequestToken(x.contribution_id);
      });
  };

  /**
   * Get a ContributionRequest at loading
   */
  React.useEffect(() => {
    setTimeout(() => {
      fetchReportRequest();
    }, 3000); // Delaying the query helps reducing the load
  }, []);

  /**
   * Sets 'hasBeenSubmitted' when the Submit button is clicked. We need this
   * because Formik will not call our onSubmit function when the submit button
   * is clicked _but_ validation fails. This makes sense, but because we want to
   * change the way validation errors are presented to the user after the first
   * submit attempt, we need to track "attempts" separately.
   */
  const onSubmitClick = React.useCallback(() => {
    setHasBeenSubmitted(true);
  }, [setHasBeenSubmitted]);

  /**
   * Called when the form is submitted and has passed validation.
   */
  const onSubmit = React.useCallback(
    (values: FormValues, { setErrors, setSubmitting }: FormikHelpers<FormValues>) => {
      const reportData = {
        contribution_id: reportRequestToken,
        contribution_answer: values.secAnswer,
        pack_id: packId,
        content: values.submitterComments
      };

      void fetch(API_URL_REPORT, {
        method: 'PUT',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      }).then(async response =>
        response
          .json()
          .then(data => ({
            data: data,
            status: response.status
          }))
          .then(res => {
            if (res.status === 400) {
              setErrors({
                secAnswer: res.data.error
              });
              setRequestSent(false);
              setSubmitting(false);
              return;
            }
            setRequestSent(true);
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
          })
      );
    },
    [reportRequestQuestion, reportRequestToken]
  );


  return (
    <div className="my-4 p-lg-3 px-lg-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Report a pack</h1>
          <p className="mt-lg-3 mb-4">
            <p>Use this form to report a pack to Signalstickers' admins.</p>
            <p>Please add context and explain why you are reporting this pack.</p>
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
          >
            {({ errors, isValidating, isSubmitting }) => (
              <Form noValidate>

                {/* [Field] Pack title */}
                <div className="form-group">
                  <div className="form-row">
                    <label className="col-12" htmlFor="pack-title">
                      Pack to report
                      <Field
                        type="text"
                        id="pack-title"
                        name="pack-title"
                        className="form-control mt-2"
                        disabled
                        value={stickerPack?.manifest.title}
                      />
                    </label>
                  </div>
                </div>

                {/* [Field] Submitter comments */}
                <div className="form-group">
                  <div className="form-row">
                    <label className="col-12" htmlFor="submitterComments">
                      Why are you reporting this pack?
                      <Field
                        as="textarea"
                        type="textarea"
                        id="submitterComments"
                        name="submitterComments"
                        className="form-control mt-2"
                        disabled={requestSent}
                        validate={validators.submitterComments}
                        maxLength="1999"
                      />
                      <small className="form-text text-muted">
                        Please add details about your report. Do not enter
                        personal information.
                      </small>
                      <div className="invalid-feedback">
                        <ErrorMessage name="submitterComments" />
                        &nbsp;
                      </div>
                    </label>
                  </div>
                </div>

                {/* [Field] Security answer */}
                <div className="form-group">
                  <div className="form-row">
                    <label
                      className={cx(
                        'col-12',
                        errors.secAnswer && 'text-danger'
                      )}
                      htmlFor="secAnswer"
                    >
                      {reportRequestQuestion}
                      <Field
                        type="text"
                        id="secAnswer"
                        name="secAnswer"
                        validate={validators.secAnswer}
                        className={cx('form-control', 'mt-2', errors.secAnswer && 'is-invalid')}
                        disabled={requestSent}
                      />
                      <small className="form-text text-muted">
                        This question helps us to make sure that you are not a
                        robot. The answer is a single word or number, without
                        quotes.
                      </small>
                      <div className="invalid-feedback">
                        <ErrorMessage name="secAnswer" />
                        &nbsp;
                      </div>
                    </label>
                  </div>
                </div>

                {/* [Control] Submit */}
                <div className="form-group">
                  <div className="form-row">
                    <div className="col-12">
                      <button
                        type="submit"
                        className={`btn btn-block btn-lg ${
                          requestSent ? 'btn-success' : 'btn-primary '
                        }`}
                        disabled={isSubmitting || isValidating || requestSent}
                        onClick={onSubmitClick}
                      >
                        {requestSent ? (
                          <span>Report sent, thanks!</span>
                        ) : (
                          <span>Report</span>
                        )}
                        {isSubmitting}
                      </button>
                      {requestSent ? (
                        <Link
                          type="reset"
                          className="btn btn-block btn-lg btn-primary"
                          to="/"
                        >
                          Return to homepage
                        </Link>
                      ) :
                        ''
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
