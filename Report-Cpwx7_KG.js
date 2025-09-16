import { R as React, af as useParams, i as useAsyncEffect, j as jsxRuntimeExports, as as Formik, at as Form, au as Field, c as cx, av as ErrorMessage, L as Link } from "./vendor-BHPvmmhE.js";
import { b as getStickerPack, h as API_URL_REPORT, d as API_URL_CONTRIBUTIONREQUEST } from "./index-lLzZPlSr.js";
const initialValues = {
  secAnswer: "",
  submitterComments: ""
};
const validators = {
  secAnswer: (secAnswer) => {
    if (secAnswer === "") {
      return "This field is required.";
    }
  },
  submitterComments: (submitterComments) => {
    if (submitterComments.length <= 30) {
      return "Please give more details (min 30 chars).";
    }
  }
};
function ReportPack() {
  const [hasBeenSubmitted, setHasBeenSubmitted] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);
  const [reportRequestToken, setReportRequestToken] = React.useState("");
  const [reportRequestQuestion, setReportRequestQuestion] = React.useState("");
  const { packId } = useParams();
  const [stickerPack, setStickerPack] = React.useState();
  useAsyncEffect(async () => {
    try {
      if (!packId) {
        return;
      }
      setStickerPack(await getStickerPack(packId));
    } catch {
    }
  }, [packId]);
  const fetchReportRequest = () => {
    void fetch(API_URL_CONTRIBUTIONREQUEST, {
      // We use the same URL API than the contribution request
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    }).then(async (x) => x.json()).then((x) => {
      setReportRequestQuestion(x.contribution_question);
      setReportRequestToken(x.contribution_id);
    });
  };
  React.useEffect(() => {
    setTimeout(() => {
      fetchReportRequest();
    }, 3e3);
  }, []);
  const onSubmitClick = React.useCallback(() => {
    setHasBeenSubmitted(true);
  }, [setHasBeenSubmitted]);
  const onSubmit = React.useCallback(
    (values, { setErrors, setSubmitting }) => {
      const reportData = {
        contribution_id: reportRequestToken,
        contribution_answer: values.secAnswer,
        pack_id: packId,
        content: values.submitterComments
      };
      void fetch(API_URL_REPORT, {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reportData)
      }).then(
        async (response) => response.json().then((data) => ({
          data,
          status: response.status
        })).then((res) => {
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
            behavior: "smooth"
          });
        })
      );
    },
    [reportRequestQuestion, reportRequestToken]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-4 p-lg-3 px-lg-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-4", children: "Report a pack" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-lg-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Use this form to report a pack to Signalstickers' admins." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Please add context and explain why you are reporting this pack." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "pt-3 pb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12 col-md-10 offset-md-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Formik,
      {
        initialValues,
        onSubmit,
        validateOnChange: hasBeenSubmitted,
        validateOnBlur: hasBeenSubmitted,
        children: ({ errors, isValidating, isSubmitting }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "col-12", htmlFor: "pack-title", children: [
            "Pack to report",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field,
              {
                type: "text",
                id: "pack-title",
                name: "pack-title",
                className: "form-control mt-2",
                disabled: true,
                value: stickerPack?.manifest.title
              }
            )
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: cx(
                "col-12",
                errors.submitterComments && "text-danger"
              ),
              htmlFor: "submitterComments",
              children: [
                "Why are you reporting this pack?",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    as: "textarea",
                    type: "textarea",
                    id: "submitterComments",
                    name: "submitterComments",
                    className: cx("form-control mt-2", errors.submitterComments && "is-invalid"),
                    disabled: requestSent,
                    validate: validators.submitterComments,
                    maxLength: "1999"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "form-text text-muted", children: "Please add details about your report. Do not enter personal information." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invalid-feedback", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { name: "submitterComments" }),
                  " "
                ] })
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: cx(
                "col-12",
                errors.secAnswer && "text-danger"
              ),
              htmlFor: "secAnswer",
              children: [
                reportRequestQuestion,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    type: "text",
                    id: "secAnswer",
                    name: "secAnswer",
                    validate: validators.secAnswer,
                    className: cx("form-control", "mt-2", errors.secAnswer && "is-invalid"),
                    disabled: requestSent
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "form-text text-muted", children: "This question helps us to make sure that you are not a robot. The answer is a single word or number, without quotes." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "invalid-feedback", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { name: "secAnswer" }),
                  " "
                ] })
              ]
            }
          ) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "submit",
                className: `btn btn-block btn-lg ${requestSent ? "btn-success" : "btn-primary "}`,
                disabled: isSubmitting || isValidating || requestSent,
                onClick: onSubmitClick,
                children: [
                  requestSent ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Report sent, thanks!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Report" }),
                  isSubmitting
                ]
              }
            ),
            requestSent ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                type: "reset",
                className: "btn btn-block btn-lg btn-primary",
                to: "/",
                children: "Return to homepage"
              }
            ) : ""
          ] }) }) })
        ] })
      }
    ) }) })
  ] });
}
export {
  ReportPack as default
};
//# sourceMappingURL=Report-Cpwx7_KG.js.map
