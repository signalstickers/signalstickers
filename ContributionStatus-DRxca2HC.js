import { R as React, j as jsxRuntimeExports, G as Link, ar as Formik, as as Form, at as Field, K as cx, au as ErrorMessage } from "./vendor-Ccogie0v.js";
import { d as SIGNAL_ART_URL_PATTERN, j as getPackStatus, A as ApiError } from "./index-DqJwrzpk.js";
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
  const onSubmit = React.useCallback(async (values) => {
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(values.signalArtUrl);
    if (!matches) {
      throw new Error("Unable to extract pack ID and pack key from signal.art URL.");
    }
    const [, packId, packKey] = matches;
    try {
      const status = await getPackStatus(packId, packKey);
      setPackInfo({
        error: "",
        pack_id: status.pack_id,
        pack_title: status.pack_title,
        status: status.status,
        status_comments: status.status_comments ?? ""
      });
    } catch (err) {
      if (err instanceof ApiError && err.type === "unknown_pack") {
        setPackInfo({ error: err.msg, pack_id: "", pack_title: "", status: "", status_comments: "" });
      } else {
        setPackInfo({ error: "Something went wrong. Please try again.", pack_id: "", pack_title: "", status: "", status_comments: "" });
      }
    } finally {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    }
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
        onSubmit,
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
//# sourceMappingURL=ContributionStatus-DRxca2HC.js.map
