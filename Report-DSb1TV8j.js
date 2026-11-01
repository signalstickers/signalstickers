import { R as React, ae as useParams, D as useAsyncEffect, j as jsxRuntimeExports, ar as Formik, as as Form, at as Field, K as cx, au as ErrorMessage, G as Link } from "./vendor-Ccogie0v.js";
import { c as getStickerPack, e as getSecurityQuestion, r as reportPack, A as ApiError, h as errorFieldPath } from "./index-DqJwrzpk.js";
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
  const fetchReportRequest = React.useCallback(async () => {
    try {
      const q = await getSecurityQuestion();
      setReportRequestQuestion(q.security_question);
      setReportRequestToken(q.security_id);
    } catch (err) {
      console.error("[Report] Unable to fetch security question", err);
    }
  }, []);
  React.useEffect(() => {
    setTimeout(() => {
      void fetchReportRequest();
    }, 3e3);
  }, [fetchReportRequest]);
  const onSubmitClick = React.useCallback(() => {
    setHasBeenSubmitted(true);
  }, [setHasBeenSubmitted]);
  const onSubmit = React.useCallback(
    async (values, { setErrors }) => {
      const payload = {
        pack_id: packId,
        content: values.submitterComments,
        security_id: reportRequestToken,
        security_answer: values.secAnswer
      };
      try {
        await reportPack(payload);
        setRequestSent(true);
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth"
        });
      } catch (err) {
        if (err instanceof ApiError) {
          switch (err.type) {
            case "wrong_answer":
              setErrors({ secAnswer: err.msg });
              break;
            case "security_verification_failed":
              setErrors({ secAnswer: err.msg });
              void fetchReportRequest();
              break;
            case "unknown_pack":
              setErrors({ submitterComments: err.msg });
              break;
            default:
              switch (errorFieldPath(err)) {
                case "content":
                  setErrors({ submitterComments: err.msg });
                  break;
                case "security_answer":
                  setErrors({ secAnswer: err.msg });
                  break;
                default:
                  setErrors({ secAnswer: err.msg || "Something went wrong. Please try again." });
              }
          }
        } else {
          setErrors({ secAnswer: "Something went wrong. Please try again." });
        }
      }
    },
    [fetchReportRequest, packId, reportRequestToken]
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
                /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "form-text text-muted", children: "Describe the problem here. Do not enter personal information." }),
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "alert alert-warning", role: "alert", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                "N.B. This is ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("u", { children: "not" }),
                " a communication tool for general feedback."
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Use this form only to report content issues to the moderators. Reports are private and seen only by moderators." })
            ] }),
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
//# sourceMappingURL=Report-DSb1TV8j.js.map
