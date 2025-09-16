import { R as React, j as jsxRuntimeExports, L as Link, as as Formik, at as Form, c as cx, au as Field, av as ErrorMessage } from "./vendor-BHPvmmhE.js";
import { c as SIGNAL_ART_URL_PATTERN, f as API_URL_STATUS } from "./index-lLzZPlSr.js";
const initialValues = {
  signalArtUrl: ""
};
const validators = {
  signalArtUrl: (signalArtUrl) => {
    if (!signalArtUrl) {
      return "This field is required.";
    }
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(signalArtUrl);
    if (!matches) {
      return "Invalid signal.art URL.";
    }
  }
};
function ContributionStatus() {
  const [packInfo, setPackInfo] = React.useState({
    error: "",
    pack_id: "",
    pack_title: "",
    status: "",
    status_comments: ""
  });
  const onSubmit = React.useCallback((values, { setSubmitting }) => {
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(values.signalArtUrl);
    if (!matches) {
      throw new Error("Unable to extract pack ID and pack key from signal.art URL.");
    }
    const [, packId, packKey] = matches;
    void fetch(API_URL_STATUS, {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pack_id: packId,
        pack_key: packKey
      })
    }).then(async (response) => response.json().then(
      (data) => ({
        data,
        status: response.status
      })
    ).then((res) => {
      setPackInfo(res.data);
      setSubmitting(false);
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }));
  }, [packInfo]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-4 p-lg-3 px-lg-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-4", children: "Contribution status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-lg-3 mb-4", children: "If you proposed a pack via the Contribute page, you can use this form to check the status of your contribution!" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "pt-3 pb-2" }),
    packInfo.error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-lg-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Oops!" }),
      " ",
      packInfo.error
    ] }) }) }),
    packInfo.status && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-lg-3 mb-4", children: [
      "Your pack ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: packInfo.pack_title }),
      packInfo.status === "ONLINE" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        " is ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "published" }),
        "! ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/pack/${packInfo.pack_id}`, children: "Check it here." })
      ] }),
      packInfo.status === "IN_REVIEW" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        " is ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "still in review" }),
        "! Real humans will soon check it."
      ] }),
      packInfo.status === "REFUSED" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        " has ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "not been published" }),
        "."
      ] }),
      packInfo.status_comments && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        " Moderators left a comment: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: packInfo.status_comments })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12 col-md-10 offset-md-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Formik,
      {
        initialValues,
        onSubmit: (values, helpers) => onSubmit(values, helpers),
        children: ({ errors, isValidating, isSubmitting }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: cx("col-12", errors.signalArtUrl && "text-danger"), htmlFor: "signal-art-url", children: [
            "Signal.art URL:",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field,
              {
                type: "text",
                id: "signal-art-url",
                name: "signalArtUrl",
                validate: validators.signalArtUrl,
                className: cx("form-control", "mt-2", errors.signalArtUrl && "is-invalid"),
                placeholder: "https://signal.art/addstickers/#pack_id=<your pack id>&pack_key=<your pack key>"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { name: "signalArtUrl" }),
              " "
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "submit",
              className: "btn btn-block btn-lg btn-primary",
              disabled: isSubmitting || isValidating,
              children: [
                isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Checking..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Check status" }),
                isSubmitting
              ]
            }
          ) }) }) })
        ] })
      }
    ) }) })
  ] });
}
export {
  ContributionStatus as default
};
//# sourceMappingURL=ContributionStatus-BxwuSdvo.js.map
