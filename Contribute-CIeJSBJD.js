import { ap as useFormikContext, R as React, C as getStickerPackManifest, j as jsxRuntimeExports, am as pluralize, K as cx, aq as uniq, G as Link, ar as Formik, as as Form, at as Field, au as ErrorMessage, y as find, B as pathEq } from "./vendor-Ccogie0v.js";
import { d as SIGNAL_ART_URL_PATTERN, g as getConvertedStickerInPack, e as getSecurityQuestion, f as contributePack, A as ApiError, h as errorFieldPath, E as ExternalLink, i as getStickerPackDirectory, c as getStickerPack } from "./index-DqJwrzpk.js";
import { L as LoadingSpinner } from "./LoadingSpinner-FN5mVXsc.js";
const INVALID_PACK_ERROR = "Invalid sticker pack. Please check the pack ID and key.";
function PackPreviewCard(props) {
  const { url } = props;
  const { setFieldError } = useFormikContext();
  const [manifest, setManifest] = React.useState(null);
  const [coverImage, setCoverImage] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(url);
    if (!matches) {
      setManifest(null);
      setCoverImage(void 0);
      setIsLoading(false);
      return;
    }
    const [, packId, packKey] = matches;
    setIsLoading(true);
    void (async () => {
      let packManifest;
      try {
        packManifest = await getStickerPackManifest(packId, packKey);
      } catch {
        {
          setManifest(null);
          setCoverImage(void 0);
          setIsLoading(false);
          setFieldError("signalArtUrl", INVALID_PACK_ERROR);
        }
        return;
      }
      setFieldError("signalArtUrl", void 0);
      setManifest(packManifest);
      setIsLoading(false);
      try {
        const image = await getConvertedStickerInPack(packId, packKey, packManifest.cover.id);
        if (!cancelled) {
          setCoverImage(image);
        }
      } catch (err) {
        {
          console.error(`[PackPreviewCard::Effect::GetCover] ${err.message}`);
        }
      }
    })();
  }, [
    url,
    setFieldError
  ]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {});
  }
  if (!manifest) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "d-flex align-items-center mt-2", children: [
    coverImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        className: "mr-3",
        style: {
          height: "72px",
          objectFit: "contain",
          width: "72px"
        },
        src: coverImage,
        alt: "Cover"
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mr-3",
        style: {
          height: "72px",
          width: "72px"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: manifest.title }) }),
      manifest.author && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "by ",
        manifest.author
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        manifest.stickers.length,
        " ",
        pluralize("sticker", manifest.stickers.length)
      ] })
    ] })
  ] });
}
function TagInput({ name, tags, onTagsChange, maxTags, disabled, error }) {
  const inputRef = React.useRef(null);
  const [currentText, setCurrentText] = React.useState("");
  const addTag = React.useCallback((text) => {
    const trimmed = text.trim();
    const isBelowMaxTags = maxTags === void 0 || tags.length < maxTags;
    if (trimmed && !tags.includes(trimmed) && isBelowMaxTags) {
      onTagsChange([...tags, trimmed]);
    }
    setCurrentText("");
  }, [tags, onTagsChange, maxTags]);
  const handleKeyDown = React.useCallback((e) => {
    if (disabled) return;
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag(currentText);
    } else if (e.key === "Backspace" && currentText === "") {
      e.preventDefault();
      if (tags.length > 0) {
        const lastTag = tags[tags.length - 1];
        onTagsChange(tags.slice(0, -1));
        setCurrentText(lastTag);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  }, [disabled, currentText, tags, onTagsChange, addTag]);
  const handleInputChange = React.useCallback((e) => {
    setCurrentText(e.target.value);
  }, []);
  const removeTag = React.useCallback((index) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  }, [tags, onTagsChange]);
  const handleTagClick = React.useCallback((index) => {
    if (disabled) return;
    removeTag(index);
  }, [disabled, removeTag]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cx("border rounded px-2 py-1 d-flex flex-wrap align-items-center", "min-h-tag-input", error && "is-invalid"), children: [
    tags.map((tag, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: cx(
          "btn btn-primary btn-sm px-2 py-1 rounded-lg text-capitalize text-nowrap mr-1 mb-1",
          disabled && "opacity-50 cursor-not-allowed"
        ),
        disabled,
        onClick: () => handleTagClick(index),
        title: disabled ? "" : `Remove tag "${tag}"`,
        children: tag
      },
      tag
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: inputRef,
        type: "text",
        name,
        className: "border-0 shadow-none flex-grow-1",
        style: { minWidth: "8rem", display: "inline-block" },
        value: currentText,
        onChange: handleInputChange,
        onKeyDown: handleKeyDown,
        disabled,
        placeholder: disabled ? "" : "Type a tag + Enter"
      }
    )
  ] });
}
const MAX_TAGS = 40;
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
    if (source && source.length > 256) {
      return "This field must be no longer than 256 characters.";
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
  const [securityId, setSecurityId] = React.useState("");
  const [securityQuestion, setSecurityQuestion] = React.useState("");
  const [tagArray, setTagArray] = React.useState([]);
  const fetchSecurityQuestion = React.useCallback(async () => {
    try {
      const q = await getSecurityQuestion();
      setSecurityQuestion(q.security_question);
      setSecurityId(q.security_id);
    } catch (err) {
      console.error("[Contribute] Unable to fetch security question", err);
    }
  }, []);
  React.useEffect(() => {
    setTimeout(() => {
      void fetchSecurityQuestion();
    }, 3e3);
  }, [fetchSecurityQuestion]);
  const onSubmitClick = React.useCallback(() => {
    setHasBeenSubmitted(true);
  }, [
    setHasBeenSubmitted
  ]);
  const handleReset = React.useCallback(({ resetForm }) => {
    void fetchSecurityQuestion();
    resetForm();
    setRequestSent(false);
    setTagArray([]);
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [
    fetchSecurityQuestion,
    requestSent
  ]);
  const onSubmit = React.useCallback(async (values, { setErrors }) => {
    const matches = new RegExp(SIGNAL_ART_URL_PATTERN).exec(values.signalArtUrl);
    if (!matches) {
      throw new Error("Unable to extract pack ID and pack key from signal.art URL.");
    }
    const [, packId, packKey] = matches;
    const tags = uniq(tagArray.map((tag) => tag.trim()).filter((tag) => tag.length));
    const payload = {
      pack: {
        id: packId,
        key: packKey,
        source: values.source,
        tags,
        nsfw: values.isNsfw === "true",
        original: values.isOriginal === "true"
      },
      submitter_comments: values.submitterComments,
      security_id: securityId,
      security_answer: values.secAnswer
    };
    try {
      await contributePack(payload);
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
            void fetchSecurityQuestion();
            break;
          case "duplicate_pack":
            setErrors({ signalArtUrl: err.msg });
            break;
          case "pack_invalid":
            setErrors({ signalArtUrl: err.msg });
            break;
          default:
            switch (errorFieldPath(err)) {
              case "pack.id":
              case "pack.key":
                setErrors({ signalArtUrl: err.msg });
                break;
              case "pack.source":
                setErrors({ source: err.msg });
                break;
              case "pack.tags":
                setErrors({ tags: err.msg });
                break;
              case "pack.nsfw":
                setErrors({ isNsfw: err.msg });
                break;
              case "pack.original":
                setErrors({ isOriginal: err.msg });
                break;
              case "security_answer":
                setErrors({ secAnswer: err.msg });
                break;
              case "submitter_comments":
                setErrors({ submitterComments: err.msg });
                break;
              default:
                setErrors({ secAnswer: err.msg || "Something went wrong. Please try again." });
            }
        }
      } else {
        setErrors({ secAnswer: "Something went wrong. Please try again." });
      }
    }
  }, [fetchSecurityQuestion, securityId, tagArray]);
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
        onSubmit: (values, { setErrors }) => onSubmit(values, { setErrors }),
        validateOnChange: hasBeenSubmitted,
        validateOnBlur: hasBeenSubmitted,
        children: ({ errors, isValidating, isSubmitting, resetForm, values }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Form, { noValidate: true, children: [
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
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PackPreviewCard, { url: values.signalArtUrl })
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
              TagInput,
              {
                name: "tags",
                tags: tagArray,
                onTagsChange: setTagArray,
                maxTags: MAX_TAGS,
                disabled: requestSent,
                error: !!errors.tags
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "form-text text-muted", children: "Type and press Enter to add a tag. Backspace to edit last tag. Click a tag to remove it." }),
            tagArray.length >= MAX_TAGS && /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "form-text text-danger", children: [
              "Maximum of ",
              MAX_TAGS,
              " tags reached."
            ] }),
            tagArray.some((tag) => tag.toLowerCase() === "furry") && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "form-text text-danger", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-weight-bold", children: /* @__PURE__ */ jsxRuntimeExports.jsx("u", { children: "IMPORTANT" }) }),
              ": our furry review guidelines have changed. Furry packs that contain ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-weight-bold", children: "graphic/sexual content will now be rejected." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "Moreover, ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-weight-bold", children: "we will remove the already submitted packs that contain graphic/sexual content in a few weeks/months." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "If you are the person who contributes to a lot of these packs, please include a way to contact you (",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "signal.me" }),
              " link, email address, Telegram, ...) in the Comments field, so we can discuss how you can archive the content before we remove it."
            ] }),
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
            securityQuestion,
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("small", { className: "form-text text-muted", children: "This will only be visible to moderators. Do not enter personal information. Or just say hello, we love it :-)" })
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
//# sourceMappingURL=Contribute-CIeJSBJD.js.map
