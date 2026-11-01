import { a1 as queryString, ao as useLocation, R as React, D as useAsyncEffect, j as jsxRuntimeExports, K as cx, G as Link } from "./vendor-Ccogie0v.js";
import { C as Context, g as getConvertedStickerInPack, S as SPARKLE_GOLD } from "./index-DqJwrzpk.js";
function useQuery() {
  return queryString.parse(useLocation().search);
}
function hash(str, seed) {
  let h = seed;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return (h % 1e4 / 1e4 + 1e4) % 1;
}
function generateSparkles(id, count = 16) {
  const phase = (i) => i / count;
  return Array.from({ length: count }, (_, i) => {
    const h1 = hash(id, i * 7919);
    const h2 = hash(id, i * 10472 + 1);
    const h3 = hash(id, i * 13003 + 2);
    const h4 = hash(id, i * 16007 + 3);
    const duration = 3 + hash(id, i * 19531 + 4) * 2;
    return {
      top: `${h1 * 100}%`,
      left: `${h2 * 100}%`,
      fontSize: `${8 + h3 * 12}px`,
      opacity: 0.5 + h4 * 0.45,
      duration: `${duration}s`,
      /**
       * Negative delay offset by a regular phase so sparkles are evenly
       * staggered. A small jitter (±10% of one slot) keeps it organic.
       */
      delay: `-${(phase(i) + hash(id, i * 23003 + 5) * 0.2) * duration}s`
    };
  });
}
var __default__$1 = { stickerPackPreviewCard: "n06ofj1", cardImageTop: "n06ofj2", cardHeader: "n06ofj3", originalAnnotation: "n06ofj4", animatedAnnotation: "n06ofj5", sparkleCardHeader: "n06ofj6", sparkle: "n06ofj7" };
function StickerPackPreviewCard(props) {
  const { hasEditorsChoiceFilter } = React.useContext(Context);
  const [cover, setCover] = React.useState();
  const { meta, manifest } = props.stickerPack;
  useAsyncEffect(async () => {
    try {
      const coverId = manifest.cover_id ?? 0;
      if (meta.id !== void 0) {
        const coverImage = await getConvertedStickerInPack(meta.id, meta.key, coverId);
        setCover(coverImage);
      }
    } catch (err) {
      console.error(`[StickerPackPreviewCard::Effect::GetCover] ${err.message}`);
    }
  }, [
    meta.id,
    meta.key,
    manifest
  ]);
  const originalAnnotation = React.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: cx(__default__$1.originalAnnotation, "shadow-sm"), children: "Original" }), []);
  const animatedAnnotation = React.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: cx(__default__$1.animatedAnnotation, "shadow-sm"), children: "Animated" }), []);
  const title = `${manifest.title}${meta.nsfw ? " (NSFW)" : ""}`;
  const sparkles = React.useMemo(() => {
    if (!meta.editorschoice || hasEditorsChoiceFilter) {
      return [];
    }
    return generateSparkles(meta.id, 11);
  }, [meta.editorschoice, meta.id, hasEditorsChoiceFilter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cx(__default__$1.stickerPackPreviewCard, "card"),
      "aria-label": title,
      children: [
        meta.original && originalAnnotation,
        meta.animated && animatedAnnotation,
        cover ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            className: __default__$1.cardImageTop,
            style: {
              filter: meta.nsfw ? "blur(4px)" : "none"
            },
            src: cover,
            alt: "Cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: __default__$1.cardImageTop,
            style: {
              filter: meta.nsfw ? "blur(4px)" : "none"
            },
            children: " "
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cx(__default__$1.cardHeader, "card-header", {
          [__default__$1.sparkleCardHeader]: meta.editorschoice
        }), children: [
          sparkles.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: __default__$1.sparkle,
              "aria-hidden": "true",
              style: {
                top: s.top,
                left: s.left,
                fontSize: s.fontSize,
                color: `rgba(${SPARKLE_GOLD}, ${s.opacity})`,
                animationDuration: s.duration,
                animationDelay: s.delay
              },
              children: "✦"
            },
            i
          )),
          title
        ] })
      ]
    }
  );
}
var __default__ = { stickerPackLink: "_11l26wq0" };
function PackCardLink(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: `/pack/${props.stickerPack.meta.id}`,
      className: __default__.stickerPackLink,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(StickerPackPreviewCard, { stickerPack: props.stickerPack })
    }
  );
}
export {
  PackCardLink as P,
  generateSparkles as g,
  useQuery as u
};
//# sourceMappingURL=PackCardLink-BUg6wfbQ.js.map
