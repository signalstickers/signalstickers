import { R as React, j as jsxRuntimeExports, c as cx, ad as BsExclamationTriangle, L as Link, i as useAsyncEffect, ae as getEmojiForSticker, a2 as useHistory, af as useParams, ag as BsArrowLeftShort, ah as BsPlus, ai as BsStarFill, aj as BsFillCameraVideoFill, ak as BsFillHeartFill, al as BsAt, am as Linkify, an as pluralize, ao as ImEye, ap as BsTag } from "./vendor-BHPvmmhE.js";
import { E as ExternalLink, g as getConvertedStickerInPack, C as Context, b as getStickerPack, s as sendPackBeacon } from "./index-lLzZPlSr.js";
import { u as useQuery } from "./use-query-D-qmeKJI.js";
var __default__$2 = { nsfwModal: "_1btvtsr0" };
function NsfwModal() {
  React.useEffect(() => {
    $("#nsfw-modal").modal({
      show: true,
      // These two settings ensure the modal cannot be dismissed by clicking the
      // backdrop.
      keyboard: false,
      backdrop: "static"
    });
    $("#nsfw-modal").addClass("fade");
    $(".modal-backdrop").css("display", "none");
  }, []);
  const onHideNsfwModalClick = React.useCallback(() => {
    $("#nsfw-modal").modal("hide");
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      id: "nsfw-modal",
      className: cx(__default__$2.nsfwModal, "modal"),
      role: "dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-dialog modal-dialog-centered", role: "document", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "modal-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BsExclamationTriangle, { className: "mr-1 text-primary" }),
          " Content Warning"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "This pack has been marked ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "Not Safe For Work" }),
            " (",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { href: "https://www.urbandictionary.com/define.php?term=NSFW", children: "NSFW" }),
            ").",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "This means that it may contain nudity, sexual content, or other potentially disturbing subject matter."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "You should not view this pack at work, or with children around." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-footer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/",
              className: "btn btn-light",
              title: "Go back home",
              children: "Go back home"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn btn-primary",
              onClick: onHideNsfwModalClick,
              children: "Show the pack"
            }
          )
        ] })
      ] }) })
    }
  );
}
var __default__$1 = { sticker: "qhla2s0", stickerEmoji: "qhla2s1" };
function Sticker({ packId, packKey, stickerId }) {
  const [emoji, setEmoji] = React.useState("");
  const [stickerSrc, setStickerSrc] = React.useState("");
  useAsyncEffect(async (isMounted) => {
    const [
      emojiResult,
      stickerResult
    ] = await Promise.all([
      getEmojiForSticker(packId, packKey, stickerId),
      getConvertedStickerInPack(packId, packKey, stickerId)
    ]);
    if (isMounted()) {
      setEmoji(emojiResult);
      setStickerSrc(stickerResult);
    }
  }, [
    packId,
    packKey,
    stickerId
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__$1.sticker, children: emoji && stickerSrc ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__$1.stickerEmoji, children: emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: stickerSrc,
        alt: "Sticker",
        className: "w-100 h-100"
      }
    )
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "spinner-border text-light", role: "status", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Loading..." }) }) });
}
var __default__ = { stickerPackDetail: "q87qka0", stickerGridView: "q87qka1" };
function StickerPackError({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 my-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-10 offset-1 alert alert-danger", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "alert-heading mt-1 mb-3", children: "Error" }),
    children
  ] }) }) });
}
function Tag({ className, label }) {
  const { searcher, setSearchQuery } = React.useContext(Context);
  const history = useHistory();
  const onTagClick = React.useCallback((event) => {
    event.preventDefault();
    if (searcher) {
      setSearchQuery(searcher.buildQueryString({
        attributeQueries: [{
          tag: label
        }]
      }));
      history.push("/");
    }
  }, [searcher]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      title: `View more packs with tag "${label}"`,
      className: cx(
        "btn btn-primary btn-sm px-2 py-1 rounded-lg text-capitalize text-nowrap",
        className
      ),
      role: "link",
      onClick: onTagClick,
      children: label
    }
  );
}
const linkifyHrefDecorator = (decoratedHref, decoratedText, key) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { href: decoratedHref, children: decoratedText }, key);
};
function StickerPackDetail() {
  const { setSearchQuery, searcher } = React.useContext(Context);
  const history = useHistory();
  const query = useQuery();
  const { packId } = useParams();
  const key = typeof query.key === "string" ? query.key : void 0;
  const [stickerPack, setStickerPack] = React.useState();
  const [stickerPackError, setStickerPackError] = React.useState("");
  useAsyncEffect(async () => {
    try {
      if (!packId) {
        return;
      }
      setStickerPack(await getStickerPack(packId, key));
      sendPackBeacon(packId);
    } catch (err) {
      if (err.code) {
        setStickerPackError(err.code);
      }
    }
  }, [
    key,
    packId
  ]);
  const onAuthorClick = React.useCallback((event) => {
    event.preventDefault();
    if (searcher && event.currentTarget.textContent) {
      setSearchQuery(searcher.buildQueryString({
        attributeQueries: [{
          author: event.currentTarget.textContent
        }]
      }));
      history.push("/");
    }
  }, [
    history,
    searcher,
    setSearchQuery
  ]);
  if (!packId || !stickerPack) {
    if (stickerPackError) {
      switch (stickerPackError) {
        case "NO_KEY_PROVIDED":
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(StickerPackError, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "This sticker pack is not listed in the Signal Stickers directory. However, if you have the pack's ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "key" }),
              ", you can still preview the sticker pack by supplying a ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "key" }),
              "parameter in the URL."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              "For example: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: `/pack/${packId}?key=sticker-pack-key` })
            ] })
          ] });
        case "MANIFEST_DECRYPT":
          return /* @__PURE__ */ jsxRuntimeExports.jsx(StickerPackError, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "The provided key is invalid." }) });
        default:
          return /* @__PURE__ */ jsxRuntimeExports.jsx(StickerPackError, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "An unknown error occurred (",
            stickerPackError,
            ")."
          ] }) });
      }
    }
    return null;
  }
  const author = stickerPack.manifest.author.trim() ? stickerPack.manifest.author : "Anonymous";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cx(__default__.stickerPackDetail, "px-1 px-sm-4 py-4 mt-0 my-sm-4"),
      children: [
        stickerPack.meta.nsfw && /* @__PURE__ */ jsxRuntimeExports.jsx(NsfwModal, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row mb-4 flex-column-reverse flex-lg-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12 col-lg-8 mt-2 mt-lg-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: stickerPack.manifest.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                role: "link",
                title: `View more packs from ${author}`,
                className: "btn btn-link p-0 border-0 text-left",
                onClick: onAuthorClick,
                children: author
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12 col-lg-4 d-flex d-lg-block justify-content-between text-md-right mb-3 mb-lg-0", children: [
            stickerPack.meta.unlisted ? null : /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "btn btn-light mr-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BsArrowLeftShort, { className: "arrow-left-icon" }),
              " Back"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              ExternalLink,
              {
                href: `https://signal.art/addstickers/#pack_id=${packId}&pack_key=${stickerPack.meta.key}`,
                className: "btn btn-primary",
                title: "Add to Signal",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BsPlus, { className: "plus-icon" }),
                  " Add to Signal"
                ]
              }
            )
          ] })
        ] }),
        !stickerPack.meta.unlisted && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12 col-lg-9", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-group", children: [
          stickerPack.meta.original && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "list-group-item text-wrap text-break", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BsStarFill, { title: "Original", className: "star-icon mr-4" }),
            "This pack has been created exclusively for Signal by the artist, from original artworks."
          ] }),
          stickerPack.meta.animated && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "list-group-item text-wrap text-break", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BsFillCameraVideoFill, { title: "Animated", className: "text-primary mr-4" }),
            "This pack contains animated stickers!"
          ] }),
          stickerPack.meta.editorschoice && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "list-group-item text-wrap text-break", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BsFillHeartFill, { title: "Editor's choice", className: "text-primary mr-4" }),
            "Editor's choice: we love this pack!"
          ] }),
          stickerPack.meta.source && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "list-group-item text-wrap text-break", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BsAt, { title: "Source", className: "mr-4 text-primary mention-icon" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Linkify, { componentDecorator: linkifyHrefDecorator, children: stickerPack.meta.source }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "list-group-item text-wrap text-break", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ImEye, { className: "mr-4 text-primary" }),
            "  ",
            stickerPack.meta.hotviews ?? 0,
            " ",
            pluralize("view", stickerPack.meta.hotviews),
            " last month, ",
            stickerPack.meta.totalviews ?? 0,
            " total"
          ] }),
          stickerPack.meta.tags && stickerPack.meta.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "list-group-item", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BsTag, { title: "Tags", className: "mr-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-wrap text-break mb-n1", children: stickerPack.meta.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "mb-1 mr-1", label: tag }, tag)) })
          ] })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__.stickerGridView, children: stickerPack.manifest.stickers.map((sticker) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Sticker,
          {
            packId,
            packKey: stickerPack.meta.key,
            stickerId: sticker.id
          },
          sticker.id
        )) }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nbStickers row justify-content-center align-items-center mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { className: "mr-3", children: [
            stickerPack.manifest.stickers.length,
            " ",
            pluralize("sticker", stickerPack.manifest.stickers.length)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/pack/${packId}/report`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "🚨 Report this pack" }) })
        ] })
      ]
    }
  );
}
export {
  StickerPackDetail as default
};
//# sourceMappingURL=StickerPackDetail-CkMWHFD2.js.map
