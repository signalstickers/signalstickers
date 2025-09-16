import { a2 as useHistory, a3 as queryString, a4 as mergeDeepRight, R as React, j as jsxRuntimeExports, a5 as a, a6 as debounceFn, c as cx, a7 as BsSearch, a8 as HashLink, a9 as FaInfoCircle, aa as BsX, i as useAsyncEffect, ab as take, L as Link, ac as Waypoint } from "./vendor-BHPvmmhE.js";
import { P as PRIMARY_DARKER, a as PRIMARY_LIGHTER, C as Context, g as getConvertedStickerInPack, S as SEARCH_QUERY_PARAM, E as ExternalLink } from "./index-lLzZPlSr.js";
import { u as useQuery } from "./use-query-D-qmeKJI.js";
function useUpdateUrl() {
  const history = useHistory();
  return (newValues) => {
    const currentUrl = queryString.parseUrl(history.location.pathname);
    const newUrl = queryString.stringifyUrl(mergeDeepRight(currentUrl, newValues), {
      // This ensures that the search query param is removed from the URL when
      // the search query is cleared.
      skipEmptyString: true
    });
    history.replace(newUrl);
  };
}
var __default__$2 = { searchInputWrapper: "mnjsqk0", searchInput: "mnjsqk1", searchInputLabel: "mnjsqk2", searchPrepend: "mnjsqk3", searchHelp: "mnjsqk4", searchHelpLink: "mnjsqk5", searchHelpIcon: "mnjsqk6", searchClear: "mnjsqk7", searchClearButton: "mnjsqk8", searchClearIcon: "mnjsqk9", miniTag: "mnjsqka", miniTagAnimated: "mnjsqkb mnjsqka", miniTagEditorsChoice: "mnjsqkc mnjsqka" };
function ToggleSwitch({ id, onToggle }) {
  const [checked, setChecked] = React.useState(false);
  const handleChange = React.useCallback(() => {
    setChecked((state) => !state);
  }, [setChecked]);
  React.useEffect(() => {
    onToggle(checked);
  }, [checked]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    a,
    {
      checked,
      onChange: handleChange,
      onColor: PRIMARY_LIGHTER,
      onHandleColor: PRIMARY_DARKER,
      handleDiameter: 12,
      uncheckedIcon: false,
      checkedIcon: false,
      boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.6)",
      activeBoxShadow: "0px 0px 1px 10px rgba(0, 0, 0, 0.2)",
      height: 10,
      width: 24,
      className: "react-switch",
      id
    }
  );
}
function SearchInputComponent() {
  const { searcher, searchQuery, searchResults, setSearchQuery, sortOrder, setSortOrder, setShowNsfw } = React.useContext(Context);
  const [searchQueryInputValue, setSearchQueryInputValue] = React.useState("");
  const searchHelpRef = React.useRef(null);
  const suggestedTags = ["cute", "privacy", "meme", "for children"];
  const debouncedSetSearchQuery = debounceFn(setSearchQuery, { wait: 250 });
  React.useEffect(() => {
    if (searchQuery) {
      setSearchQueryInputValue(searchQuery);
    }
  }, [searchQuery]);
  const onSearchQueryInputChange = React.useCallback((event) => {
    const { value } = event.target;
    setSearchQueryInputValue(value);
  }, [
    setSearchQueryInputValue
  ]);
  const onSortOrderChange = React.useCallback((event) => {
    const { value } = event.target;
    setSortOrder(value);
  }, [
    setSortOrder
  ]);
  React.useEffect(() => {
    debouncedSetSearchQuery.cancel();
    debouncedSetSearchQuery(searchQueryInputValue);
    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [
    debouncedSetSearchQuery,
    searchQueryInputValue
  ]);
  const onSuggestionClick = React.useCallback((event) => {
    if (searcher && event.currentTarget.textContent) {
      switch (event.currentTarget.dataset.suggestionType) {
        case "tag":
          setSearchQuery(searcher.buildQueryString({
            attributeQueries: [{
              tag: event.currentTarget.textContent
            }]
          }));
          break;
        case "animated":
          setSearchQuery(searcher.buildQueryString({
            attributeQueries: [{
              animated: "true"
            }]
          }));
          break;
        case "editorschoice":
          setSearchQuery(searcher.buildQueryString({
            attributeQueries: [{
              editorschoice: "true"
            }]
          }));
          break;
      }
    }
  }, [
    searcher,
    setSearchQuery
  ]);
  const handleInputFocus = React.useCallback(() => {
    if (!searchHelpRef.current) {
      return;
    }
    searchHelpRef.current.style.opacity = "1";
    searchHelpRef.current.style.pointerEvents = "initial";
  }, [
    searchHelpRef
  ]);
  const handleInputBlur = React.useCallback(() => {
    if (!searchHelpRef.current) {
      return;
    }
    searchHelpRef.current.style.opacity = "0";
    setTimeout(() => {
      if (!searchHelpRef.current) {
        return;
      }
      searchHelpRef.current.style.pointerEvents = "none";
    }, 250);
  }, [
    searchHelpRef
  ]);
  const clearSearchResults = React.useCallback((event) => {
    event.preventDefault();
    setSearchQueryInputValue("");
    setSearchQuery("");
  }, [
    setSearchQueryInputValue,
    setSearchQuery
  ]);
  const onNsfwToggle = (state) => {
    setShowNsfw(state);
  };
  React.useEffect(() => {
    if (searchQuery) {
      setSearchQueryInputValue(searchQuery);
    }
  }, [searchQuery]);
  React.useEffect(() => {
    debouncedSetSearchQuery.cancel();
    debouncedSetSearchQuery(searchQueryInputValue);
    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, [
    debouncedSetSearchQuery,
    searchQueryInputValue
  ]);
  const tagsFragment = React.useMemo(() => suggestedTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: cx(__default__$2.miniTag, "btn", "mr-1"),
      onClick: onSuggestionClick,
      "data-suggestion-type": "tag",
      children: tag
    },
    tag
  )), [suggestedTags]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cx(__default__$2.searchInputWrapper, "form-group", "mb-4"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 position-relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__$2.searchPrepend, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsSearch, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          className: cx(__default__$2.searchInput, "form-control", "form-control-lg"),
          onBlur: handleInputBlur,
          onChange: onSearchQueryInputChange,
          onFocus: handleInputFocus,
          value: searchQueryInputValue,
          title: "Search",
          "aria-label": "search",
          autoComplete: "off",
          autoCapitalize: "off",
          autoCorrect: "off",
          spellCheck: "false"
        },
        "search"
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__$2.searchHelp, ref: searchHelpRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx(HashLink, { to: "/about#searching", title: "Search Help", className: __default__$2.searchHelpLink, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaInfoCircle, { className: cx(__default__$2.searchHelpIcon, "text-muted") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__$2.searchClear, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: cx(__default__$2.searchClearButton, "btn", "btn-link", "border-0"),
          title: "Clear Search Results",
          onClick: clearSearchResults,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsX, { className: __default__$2.searchClearIcon })
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "d-flex justify-content-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
          "Suggested: ",
          " "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", { className: "d-inline d-md-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: cx(
              __default__$2.miniTagAnimated,
              "btn",
              "mr-1"
            ),
            onClick: onSuggestionClick,
            "data-suggestion-type": "animated",
            children: "Animated"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: cx(__default__$2.miniTagEditorsChoice, "btn", "mr-1"),
            onClick: onSuggestionClick,
            "data-suggestion-type": "editorschoice",
            children: "Editor's choice"
          }
        ),
        tagsFragment
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
        searchResults?.length || 0,
        " ",
        searchResults.length === 1 ? "result" : "results"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 d-flex flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mr-3", children: [
        "Sort by",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "d-inline-block form-control form-control-sm w-auto ml-2", value: searchQuery ? "relevance" : sortOrder, onChange: onSortOrderChange, disabled: searchQuery !== "", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Latest" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "trending", children: "Trending" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mostViewed", children: "Most viewed (all times)" }),
          searchQuery && /* Only used as a placeholder when a searchQuery is set */
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "relevance", children: "Relevance" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: __default__$2.searchInputLabel, htmlFor: "nsfwToggle", children: [
        "Show NSFW ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleSwitch, { id: "nsfwToggle", onToggle: onNsfwToggle })
      ] }) })
    ] })
  ] });
}
var __default__$1 = { stickerPackLink: "_1y3r8up0" };
var __default__ = { stickerPackPreviewCard: "n06ofj0", cardImageTop: "n06ofj1", cardHeader: "n06ofj2", originalAnnotation: "n06ofj3", animatedAnnotation: "n06ofj4" };
function StickerPackPreviewCard(props) {
  const [cover, setCover] = React.useState();
  const { meta, manifest } = props.stickerPack;
  useAsyncEffect(async () => {
    try {
      if (manifest.cover === void 0) {
        manifest.cover = { id: 0, emoji: "" };
      }
      if (meta.id !== void 0) {
        const coverImage = await getConvertedStickerInPack(meta.id, meta.key, manifest.cover.id);
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
  const originalAnnotation = React.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: cx(__default__.originalAnnotation, "shadow-sm"), children: "Original" }), []);
  const animatedAnnotation = React.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: cx(__default__.animatedAnnotation, "shadow-sm"), children: "Animated" }), []);
  const title = `${manifest.title}${meta.nsfw ? " (NSFW)" : ""}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cx(__default__.stickerPackPreviewCard, "card"),
      "aria-label": title,
      children: [
        meta.original && originalAnnotation,
        meta.animated && animatedAnnotation,
        cover ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            className: __default__.cardImageTop,
            style: {
              filter: meta.nsfw ? "blur(4px)" : "none"
            },
            src: cover,
            alt: "Cover"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: __default__.cardImageTop,
            style: {
              filter: meta.nsfw ? "blur(4px)" : "none"
            },
            children: " "
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cx(__default__.cardHeader, "card-header"), children: title })
      ]
    }
  );
}
const PAGE_SIZE = 64;
function StickerPackListComponent() {
  const { searchResults, showNsfw } = React.useContext(Context);
  const [cursor, setCursor] = React.useState(0);
  const [renderedSearchResults, setRenderedSearchResults] = React.useState([]);
  const loadMore = React.useCallback(() => {
    if (renderedSearchResults.length >= searchResults.length) {
      return;
    }
    const newCursor = cursor + PAGE_SIZE;
    setCursor(newCursor);
    setRenderedSearchResults(take(newCursor, searchResults));
  }, [
    cursor,
    searchResults,
    renderedSearchResults
  ]);
  React.useLayoutEffect(() => {
    setCursor(0);
    setRenderedSearchResults([]);
    loadMore();
  }, [searchResults]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
    renderedSearchResults.map((result) => {
      if (!result.item.meta.nsfw || result.item.meta.nsfw && showNsfw) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "col-6 col-md-4 col-lg-3 mb-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: `/pack/${result.item.meta.id}`,
                className: __default__$1.stickerPackLink,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(StickerPackPreviewCard, { stickerPack: result.item })
              }
            )
          },
          result.item.meta.id
        );
      }
      return null;
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Waypoint,
      {
        onEnter: loadMore,
        bottomOffset: "-500px"
      },
      cursor
    )
  ] });
}
function Home() {
  const { searchQuery, setSearchQuery } = React.useContext(Context);
  const query = useQuery();
  const updateUrl = useUpdateUrl();
  React.useEffect(() => {
    const searchQueryFromUrl = query[SEARCH_QUERY_PARAM] ?? null;
    if (typeof searchQueryFromUrl === "string") {
      setSearchQuery(searchQueryFromUrl);
    }
  }, []);
  React.useEffect(() => {
    updateUrl({
      query: {
        // Coerce empty strings to null to cause the query param to be
        // removed from the URL when the search query is cleared.
        [SEARCH_QUERY_PARAM]: searchQuery
      }
    });
  }, [searchQuery]);
  const stickerPackLink = React.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx(
    ExternalLink,
    {
      href: "https://support.signal.org/hc/en-us/articles/360031836512-Stickers",
      title: "Stickers - Signal Support",
      children: "sticker packs"
    }
  ), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12 mt-4 mb-1 mb-md-3 pt-lg-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "intro", children: [
      "Welcome to Signal Stickers, the unofficial directory for Signal ",
      stickerPackLink,
      ". You can filter packs by title, author, or tags."
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchInputComponent, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StickerPackListComponent, {})
  ] });
}
export {
  Home as default
};
//# sourceMappingURL=Home-DmBMzQEk.js.map
