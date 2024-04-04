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
import { useParams } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import ExternalLink from 'components/general/ExternalLink';
import { API_URL_CONTRIBUTION_REQUEST, API_URL_REPORT } from 'etc/constants';
import { StickerPack } from 'etc/types';
import { getStickerPack } from 'lib/stickers';


interface FormValues {
  secAnswer: string;
  submitterComments: string;
}


/**
 * URL parameters that we expect to have set when this component is rendered.
 */
interface UrlParams {
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
    if (secAnswer === '') return 'This field is required.';
  },
  submitterComments: (submitterComments: string) => {
    if (submitterComments.length <= 30) return 'Please give more details (min 30 chars).';
  }
};


export default function ReportPack() {
  const { packId } = useParams<UrlParams>();
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [reportRequestId, setReportRequestId] = React.useState('');
  const [reportRequestQuestion, setReportRequestQuestion] = React.useState('');
  const [stickerPack, setStickerPack] = React.useState<StickerPack>();
  const [isInitialized, setIsInitialized] = React.useState(false);


  /**
   * [Effect] Set `stickerPack` when the component mounts.
   */
  useAsyncEffect(async isMounted => {
    try {
      if (!packId) return;
      const stickerPack = await getStickerPack(packId);
      if (!isMounted()) return;
      setStickerPack(stickerPack);
    } catch (err: any) {
      console.error('Error fetching sticker pack:', err.message);
    }
  }, [packId]);


  /**
   * [Effect] Fetches a contribution request challenge question.
   */
  useAsyncEffect(async isMounted => {
    if (isInitialized) return;

    const response = await fetch(API_URL_CONTRIBUTION_REQUEST, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();

    if (!isMounted()) return;

    setReportRequestId(json.contribution_id);
    setReportRequestQuestion(json.contribution_question);
    setIsInitialized(true);
  }, [isInitialized]);


  /**
   * Called when the form is submitted and has passed validation.
   */
  const onSubmit = React.useCallback(async (values: FormValues, { setStatus }: FormikHelpers<FormValues>) => {
    const reportData = {
      contribution_id: reportRequestId,
      pack_id: packId,
      content: values.submitterComments,
      contribution_answer: values.secAnswer
    };

    const response = await fetch(API_URL_REPORT, {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
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
  }, [
    reportRequestId,
    reportRequestQuestion
  ]);


  const contributionGuidelines = React.useMemo(() => (
    <ExternalLink
      href="https://github.com/signalstickers/signalstickers#contribution-guidelines"
      title="Signalstickers' Contribution Guidelines"
    >
      Signal Stickers' Contribution Guidelines
    </ExternalLink>
  ), []);


  return (
    <div className="my-4 p-lg-3 px-lg-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Report Pack</h1>
          <p className="mt-lg-3 mb-4">
            If you believe a sticker pack is in violation of the {contributionGuidelines}, you
            may use this form to report it to Signal Stickers.
          </p>
          <p>
            Please add context and explain why you are reporting this pack.
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
              if (status.state === 'pristine' && dirty) setStatus('dirty');
              const disabled = isSubmitting || status.state === 'success';

              return (
                <Form noValidate>

                  {/* [Field] Pack Title */}
                  <div className="mb-4">
                    <label
                      className="form-label"
                      htmlFor="pack-title"
                    >
                      Pack to report
                    </label>
                    <Field
                      id="pack-title"
                      type="text"
                      name="packTitle"
                      className="form-control form-control-lg bg-transparent"
                      disabled
                      value={stickerPack?.manifest.title ?? ''}
                    />
                  </div>

                  {/* [Field] Submitter Comments */}
                  <div className="mb-4 debug<">
                    <label
                      className="form-label"
                      htmlFor="submitter-comments"
                    >
                      Why are you reporting this pack?
                    </label>
                    <Field
                      id="submitter-comments"
                      type="textarea"
                      as="textarea"
                      name="submitterComments"
                      className={cx(
                        'form-control form-control-lg bg-transparent',
                        errors.submitterComments && 'is-invalid'
                      )}
                      disabled={disabled}
                      validate={validators.submitterComments}
                      maxLength="1999"
                      aria-describedby="submitter-comments-description submitter-comments-error"
                    />
                    <div
                      id="submitter-comments-description"
                      className="form-text"
                    >
                      Please add details about your report. Do not provide any personal information.
                    </div>
                    <div
                      id="submitter-comments-error"
                      className={cx(errors.submitterComments && 'invalid-feedback')}
                    >
                      <ErrorMessage name="submitterComments" />&nbsp;
                    </div>
                  </div>

                  {/* [Field] Security Answer */}
                  <div className="mb-4">
                    <label
                      className="fs-5 mb-1"
                      htmlFor="sec-answer"
                    >
                      {reportRequestQuestion || <span className="text-muted">Loading...</span>}
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

                  {/* Global Form Status */}
                  <div className="mb-4">
                    {status.state === 'success' ? (
                      <span className="text-success">Report submitted, thanks!</span>
                    ) : status.state === 'error' ? (
                      <span className="text-danger">{status.error}</span>
                    ) : <span>&nbsp;</span>}
                  </div>

                  {/* [Control] Submit */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-lg btn-primary"
                      disabled={disabled || status.state === 'success'}
                      onClick={() => setSubmitAttempted(true)}
                    >
                      {status.state === 'success' ? 'Success' : 'Submit Report'}
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
