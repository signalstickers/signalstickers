import { R as React, j as jsxRuntimeExports, ac as BsExclamationTriangle, G as Link, K as cx, D as useAsyncEffect, ad as getEmojiForSticker, a0 as useHistory, ae as useParams, af as BsArrowLeftShort, ag as BsPlus, ah as BsPaletteFill, ai as BsFillCameraVideoFill, a9 as IoSparklesSharp, aj as BsAt, ak as Linkify, al as ImEye, am as pluralize, an as BsTag } from "./vendor-Ccogie0v.js";
import { E as ExternalLink, C as Context, g as getConvertedStickerInPack, c as getStickerPack, s as sendPackBeacon } from "./index-DqJwrzpk.js";
import { P as PackCardLink, u as useQuery } from "./PackCardLink-BUg6wfbQ.js";
var __default__$3 = { nsfwModal: "_1btvtsr0" };
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
      className: cx(__default__$3.nsfwModal, "modal"),
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
var __default__$2 = { seeAlso: "_1m10li30", sectionTitle: "_1m10li31" };
const MAX_SECTIONS = 3;
const MAX_PACKS_PER_SECTION = 4;
const TRENDING_POOL_SIZE = 50;
const FOR_CHILDREN_TAG = "for children";
const CHILDREN_PACKS_PER_SECTION = MAX_PACKS_PER_SECTION * 2;
function topPacks(bucket, k, exclude, showNsfw) {
  const top = [];
  for (const pack of bucket) {
    if (exclude.has(pack.meta.id) || pack.meta.nsfw && !showNsfw) {
      continue;
    }
    let i = top.length;
    while (i > 0 && (top[i - 1].meta.hotviews ?? 0) < (pack.meta.hotviews ?? 0)) {
      i--;
    }
    top.splice(i, 0, pack);
    if (top.length > k) {
      top.pop();
    }
  }
  return top;
}
function randomPacks(pool, k) {
  const picked = [];
  while (picked.length < k && pool.length > 0) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return picked;
}
function SeeAlso(props) {
  const { allStickerPacks, showNsfw } = React.useContext(Context);
  const { stickerPack } = props;
  const packsByTag = React.useMemo(() => {
    const index = /* @__PURE__ */ new Map();
    for (const pack of allStickerPacks ?? []) {
      for (const tag of pack.meta.tags ?? []) {
        let bucket = index.get(tag);
        if (!bucket) {
          bucket = [];
          index.set(tag, bucket);
        }
        bucket.push(pack);
      }
    }
    return index;
  }, [
    allStickerPacks
  ]);
  const sections = React.useMemo(() => {
    if (!allStickerPacks) {
      return [];
    }
    const currentPackId = stickerPack.meta.id;
    const tags = stickerPack.meta.tags;
    const excludedPackIds = /* @__PURE__ */ new Set([currentPackId]);
    const result = [];
    const isForChildrenPack = (tags ?? []).some((tag) => tag.toLowerCase() === FOR_CHILDREN_TAG);
    if (isForChildrenPack) {
      const childrenPacks = allStickerPacks.filter((pack) => {
        if (pack.meta.id === currentPackId || pack.meta.nsfw && !showNsfw) {
          return false;
        }
        return (pack.meta.tags ?? []).some((tag) => tag.toLowerCase() === FOR_CHILDREN_TAG);
      });
      const packs = randomPacks(childrenPacks, CHILDREN_PACKS_PER_SECTION);
      if (packs.length > 0) {
        result.push({
          key: "for-children",
          title: "More packs for children",
          packs
        });
      }
      return result;
    }
    if (tags && tags.length > 0) {
      const topTags = tags.map((tag) => {
        const bucket = packsByTag.get(tag);
        if (!bucket) {
          return null;
        }
        let count = 0;
        for (const pack of bucket) {
          if (pack.meta.id !== currentPackId && (!pack.meta.nsfw || showNsfw)) {
            count++;
          }
        }
        return count > 0 ? { tag, bucket, count } : null;
      }).filter(
        (entry) => entry !== null
      ).sort((a, b) => b.count - a.count).slice(0, MAX_SECTIONS);
      topTags.forEach(({ tag, bucket }) => {
        const pool = topPacks(bucket, TRENDING_POOL_SIZE, excludedPackIds, showNsfw);
        const packs = randomPacks(pool, MAX_PACKS_PER_SECTION);
        packs.forEach((pack) => excludedPackIds.add(pack.meta.id));
        if (packs.length > 0) {
          result.push({
            key: tag,
            title: `More packs with tag "${tag}"`,
            packs
          });
        }
      });
    }
    if (result.length < MAX_SECTIONS) {
      const pool = topPacks(allStickerPacks, TRENDING_POOL_SIZE, excludedPackIds, showNsfw);
      const trending = randomPacks(pool, MAX_PACKS_PER_SECTION);
      if (trending.length > 0) {
        result.push({
          key: "trending",
          title: "More trending packs",
          packs: trending
        });
      }
    }
    return result;
  }, [
    allStickerPacks,
    packsByTag,
    showNsfw,
    stickerPack
  ]);
  if (sections.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__$2.seeAlso, children: sections.map(({ key, title, packs }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: __default__$2.sectionTitle, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: packs.map((pack) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "col-6 col-md-3 mb-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(PackCardLink, { stickerPack: pack })
      },
      pack.meta.id
    )) })
  ] }, key)) });
}
var __default__$1 = { sticker: "qhla2s0", stickerImage: "qhla2s1", stickerEmoji: "qhla2s2" };
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__$1.sticker, children: stickerSrc ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    emoji && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__$1.stickerEmoji, children: emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: stickerSrc,
        alt: "Sticker",
        className: __default__$1.stickerImage
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
  useAsyncEffect(async (isMounted) => {
    try {
      if (!packId) {
        return;
      }
      setStickerPack(void 0);
      setStickerPackError("");
      window.scrollTo({ top: 0 });
      const stickerPackToSet = await getStickerPack(packId, key);
      if (!isMounted()) {
        return;
      }
      setStickerPack(stickerPackToSet);
      sendPackBeacon(packId);
    } catch (err) {
      if (err.code && isMounted()) {
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(BsPaletteFill, { title: "Original", className: "text-primary mr-4" }),
            "This pack has been created exclusively for Signal by the artist, from original artworks."
          ] }),
          stickerPack.meta.animated && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "list-group-item text-wrap text-break", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BsFillCameraVideoFill, { title: "Animated", className: "text-primary mr-4" }),
            "This pack contains animated stickers!"
          ] }),
          stickerPack.meta.editorschoice && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "list-group-item text-wrap text-break", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(IoSparklesSharp, { title: "Editor's choice", className: "star-icon mr-4" }),
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
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SeeAlso, { stickerPack })
      ]
    }
  );
}
export {
  StickerPackDetail as default
};
//# sourceMappingURL=StickerPackDetail--XAf9VW-.js.map
