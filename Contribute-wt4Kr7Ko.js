import { R as React, ar as uniq, j as jsxRuntimeExports, L as Link, as as Formik, at as Form, c as cx, au as Field, av as ErrorMessage, Q as find, W as pathEq } from "./vendor-BHPvmmhE.js";
import { c as SIGNAL_ART_URL_PATTERN, A as API_URL_CONTRIBUTE, E as ExternalLink, d as API_URL_CONTRIBUTIONREQUEST, e as getStickerPackDirectory, b as getStickerPack } from "./index-lLzZPlSr.js";
const TAGS_PATTERN = /^(?:([\w ]+))+(?:, ?([\w ]+))*$/g;
const initialValues = {
  signalArtUrl: "",
  source: "",
  tags: "",
  isNsfw: null,
  isOriginal: null,
  secAnswer: "",
  submitterComments: ""
};
const validators = {
  signalArtUrl: async (signalArtUrl) => {
    if (!signalArtUrl) {
      return "This field is required.";
    }
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(signalArtUrl);
    if (!matches) {
      return "Invalid signal.art URL.";
    }
    const [, packId, packKey] = matches;
    if (find(pathEq(["meta", "id"], packId), await getStickerPackDirectory())) {
      return "A sticker pack with that ID already exists in the directory.";
    }
    try {
      await getStickerPack(packId, packKey);
    } catch {
      return "Invalid sticker pack. Please check the pack ID and key.";
    }
  },
  source: (source) => {
    if (source && source.length > 320) {
      return "This field must be no longer than 320 characters.";
    }
  },
  tags: (tags) => {
    if (tags !== "" && !new RegExp(TAGS_PATTERN).test(tags)) {
      return "Invalid value. Tags must be a list of comma-delimited strings.";
    }
  },
  isNsfw: (isNsfw) => {
    if (isNsfw === null) {
      return "This field is required.";
    }
  },
  isOriginal: (isOriginal) => {
    if (isOriginal === null) {
      return "This field is required.";
    }
  },
  secAnswer: (secAnswer) => {
    if (secAnswer === "") {
      return "This field is required.";
    }
  }
};
function ContributePack() {
  const [hasBeenSubmitted, setHasBeenSubmitted] = React.useState(false);
  const [requestSent, setRequestSent] = React.useState(false);
  const [contributionRequestToken, setContributionRequestToken] = React.useState("");
  const [contributionRequestQuestion, setContributionRequestQuestion] = React.useState("");
  const fetchContributionRequest = () => {
    void fetch(API_URL_CONTRIBUTIONREQUEST, {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    }).then(async (x) => x.json()).then((x) => {
      setContributionRequestQuestion(x.contribution_question);
      setContributionRequestToken(x.contribution_id);
    });
  };
  React.useEffect(() => {
    setTimeout(() => {
      fetchContributionRequest();
    }, 3e3);
  }, []);
  const onSubmitClick = React.useCallback(() => {
    setHasBeenSubmitted(true);
  }, [
    setHasBeenSubmitted
  ]);
  const handleReset = React.useCallback(({ resetForm }) => {
    fetchContributionRequest();
    resetForm();
    setRequestSent(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [
    requestSent
  ]);
  const onSubmit = React.useCallback((values, { setErrors, setSubmitting }) => {
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(values.signalArtUrl);
    if (!matches) {
      throw new Error("Unable to extract pack ID and pack key from signal.art URL.");
    }
    const [, packId, packKey] = matches;
    const tags = uniq(values.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag.length));
    const propositionData = {
      pack: {
        pack_id: packId,
        pack_key: packKey,
        source: values.source,
        tags,
        nsfw: values.isNsfw === "true" ? true : false,
        original: values.isOriginal === "true" ? true : false
      },
      contribution_id: contributionRequestToken,
      contribution_answer: values.secAnswer,
      submitter_comments: values.submitterComments
    };
    void fetch(API_URL_CONTRIBUTE, {
      method: "PUT",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(propositionData)
    }).then(async (response) => response.json().then(
      (data) => ({
        data,
        status: response.status
      })
    ).then((res) => {
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
    }));
  }, [contributionRequestQuestion, contributionRequestToken]);
  const stickerPackGuideLink = React.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ExternalLink,
    {
      href: "https://support.signal.org/hc/articles/360031836512-Stickers#h_c2a0a45b-862f-4d12-9ab1-d9a6844062ca",
      title: "Sticker Creator Guidelines",
      children: "Sticker Creator Guidelines"
    }
  ), []);
  const contributionGuidelines = React.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ExternalLink,
    {
      href: "https://github.com/signalstickers/signalstickers#contribution-guidelines",
      title: "Signalstickers' Contribution Guidelines",
      children: "Signalstickers' Contribution Guidelines"
    }
  ), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-4 p-lg-3 px-lg-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-4", children: "Contribute" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-lg-3 mb-4", children: "To get your sticker pack listed in the Signal Stickers directory:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "mb-2", children: [
          "Create a sticker pack using the Signal desktop app. For help, see Signal's ",
          stickerPackGuideLink,
          ". Be sure to save the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "signal.art" }),
          " URL for your pack. If you are creating a sticker pack derived from an existing one on another platform or from someone else's artwork, please consider using the original author's name in the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Author" }),
          " field when creating your pack in Signal, and consider adding their website, Twitter handle, or other online presence to the ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Source" }),
          " field below."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "mb-2", children: "Fill this form. Please check that your pack is not already listed on the website. Take the time to add tags, to help other users find your pack!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "mb-2", children: [
          "We will review the pack, and if it meets the ",
          contributionGuidelines,
          ", it will be publicly available on ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "signalstickers.org" }),
          " !"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "To check the status of your contribution, ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contribution-status", children: "click here." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "pt-3 pb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12 col-md-10 offset-md-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Formik,
      {
        initialValues,
        onSubmit: (values, { setErrors, setSubmitting }) => onSubmit(values, { setErrors, setSubmitting }),
        validateOnChange: hasBeenSubmitted,
        validateOnBlur: hasBeenSubmitted,
        children: ({ errors, isValidating, isSubmitting, resetForm }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { noValidate: true, children: [
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
                disabled: requestSent,
                placeholder: "https://signal.art/addstickers/#pack_id=<your pack id>&pack_key=<your pack key>"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { name: "signalArtUrl" }),
              " "
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: cx("col-12", errors.source && "text-danger"), htmlFor: "source", children: [
            "(Optional) Source:",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field,
              {
                type: "text",
                id: "source",
                name: "source",
                validate: validators.source,
                className: cx("form-control", "mt-2", errors.source && "is-invalid"),
                disabled: requestSent
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "form-text text-muted", children: "Original author, website, company, etc." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { name: "source" }),
              " "
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: cx("col-12", errors.tags && "text-danger"), htmlFor: "tags", children: [
            "(Optional) Tags:",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field,
              {
                type: "text",
                id: "tags",
                name: "tags",
                validate: validators.tags,
                className: cx("form-control", "mt-2", errors.tags && "is-invalid"),
                disabled: requestSent
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "form-text text-muted", children: "Comma-separated list of words." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { name: "tags" }),
              " "
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("legend", { className: cx("col-12", "mb-2", "fs-1", errors.isNsfw && "text-danger"), children: [
              "Is your sticker pack ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { href: "https://www.urbandictionary.com/define.php?term=NSFW", title: "NSFW", children: "NSFW" }),
              "?"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "custom-control custom-radio", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    type: "radio",
                    id: "is-nsfw-true",
                    name: "isNsfw",
                    validate: validators.isNsfw,
                    className: cx("custom-control-input", errors.isNsfw && "is-invalid"),
                    value: "true",
                    disabled: requestSent
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "custom-control-label", htmlFor: "is-nsfw-true", children: "Yes" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "custom-control custom-radio", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Field,
                    {
                      type: "radio",
                      id: "is-nsfw-false",
                      name: "isNsfw",
                      validate: validators.isNsfw,
                      className: cx("custom-control-input", errors.isNsfw && "is-invalid"),
                      value: "false",
                      disabled: requestSent
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "custom-control-label", htmlFor: "is-nsfw-false", children: "No" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { name: "isNsfw" }),
                  " "
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: cx("col-12", "mb-2", "fs-6", errors.isOriginal && "text-danger"), children: "Is your pack original? Did the author of the pack draw it exclusively for Signal, from original artworks?" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12 mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "custom-control custom-radio", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Field,
                  {
                    type: "radio",
                    id: "is-original-true",
                    name: "isOriginal",
                    validate: validators.isOriginal,
                    className: cx("custom-control-input", errors.isOriginal && "is-invalid"),
                    value: "true",
                    disabled: requestSent
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "custom-control-label", htmlFor: "is-original-true", children: "Yes" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "custom-control custom-radio", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Field,
                    {
                      type: "radio",
                      id: "is-original-false",
                      name: "isOriginal",
                      validate: validators.isOriginal,
                      className: cx("custom-control-input", errors.isOriginal && "is-invalid"),
                      value: "false",
                      disabled: requestSent
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "custom-control-label", htmlFor: "is-original-false", children: "No" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { name: "isOriginal" }),
                  " "
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: cx("col-12", errors.secAnswer && "text-danger"), htmlFor: "secAnswer", children: [
            contributionRequestQuestion,
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
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorMessage, { name: "secAnswer" }),
              " "
            ] })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "col-12", htmlFor: "submitterComments", children: [
            "(Optional) Any comments?",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Field,
              {
                as: "textarea",
                type: "textarea",
                id: "submitterComments",
                name: "submitterComments",
                className: "form-control mt-2",
                disabled: requestSent,
                maxLength: "400"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "form-text text-muted", children: "This will only be visible to moderators. Do not enter personnal information. Or just say hello, we love it :-)" })
          ] }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "submit",
                className: `btn btn-block btn-lg ${requestSent ? "btn-success" : "btn-primary "}`,
                disabled: isSubmitting || isValidating || requestSent,
                onClick: onSubmitClick,
                children: [
                  requestSent ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Request sent, thanks!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Propose to signalstickers.org" }),
                  isSubmitting
                ]
              }
            ),
            requestSent ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "reset",
                className: "btn btn-block btn-lg btn-primary",
                onClick: () => handleReset({ resetForm }),
                children: "Propose another pack"
              }
            ) : ""
          ] }) }) })
        ] })
      }
    ) }) })
  ] });
}
export {
  ContributePack as default
};
//# sourceMappingURL=Contribute-wt4Kr7Ko.js.map
