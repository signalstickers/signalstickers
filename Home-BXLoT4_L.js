import { a0 as useHistory, a1 as queryString, a2 as mergeDeepRight, R as React, j as jsxRuntimeExports, a3 as a, a4 as debounceFn, K as cx, a5 as BsSearch, a6 as HashLink, a7 as FaInfoCircle, a8 as BsX, a9 as IoSparklesSharp, aa as take, ab as Waypoint } from "./vendor-Ccogie0v.js";
import { P as PRIMARY_DARKER, a as PRIMARY_LIGHTER, C as Context, S as SPARKLE_GOLD, b as SEARCH_QUERY_PARAM, E as ExternalLink } from "./index-DqJwrzpk.js";
import { g as generateSparkles, P as PackCardLink, u as useQuery } from "./PackCardLink-BUg6wfbQ.js";
import { L as LoadingSpinner } from "./LoadingSpinner-FN5mVXsc.js";
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
var __default__ = { searchInputWrapper: "mnjsqk1", searchInput: "mnjsqk2", searchInputField: "mnjsqk3", searchInputLabel: "mnjsqk4", searchPrepend: "mnjsqk5", searchHelp: "mnjsqk6", searchHelpLink: "mnjsqk7", searchHelpIcon: "mnjsqk8", searchClear: "mnjsqk9", searchClearButton: "mnjsqka", searchClearIcon: "mnjsqkb", miniTag: "mnjsqkc", miniTagAnimated: "mnjsqkd mnjsqkc", miniTagEditorsChoice: "mnjsqke mnjsqkc", sparkle: "mnjsqkf" };
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
  const { searcher, searchQuery, searchResults, setSearchQuery, sortOrder, setSortOrder, setShowNsfw, hasEditorsChoiceFilter, isDirectoryComplete } = React.useContext(Context);
  const [searchQueryInputValue, setSearchQueryInputValue] = React.useState("");
  const searchHelpRef = React.useRef(null);
  const suggestedTags = ["cute", "privacy", "meme", "for children"];
  const debouncedSetSearchQuery = debounceFn(setSearchQuery, { wait: 250 });
  React.useEffect(() => {
    setSearchQueryInputValue(searchQuery);
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
    setSearchQuery("");
  }, [
    setSearchQuery
  ]);
  const onNsfwToggle = (state) => {
    setShowNsfw(state);
  };
  const searchSparkles = React.useMemo(() => {
    if (!hasEditorsChoiceFilter) {
      return [];
    }
    return generateSparkles("searchbar-editorschoice-sparkles-6e7a24f542", 15);
  }, [hasEditorsChoiceFilter]);
  const tagsFragment = React.useMemo(() => suggestedTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      className: cx(__default__.miniTag, "btn", "mr-1"),
      onClick: onSuggestionClick,
      "data-suggestion-type": "tag",
      children: tag
    },
    tag
  )), [suggestedTags]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cx(__default__.searchInputWrapper, "form-group", "mb-4"), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cx("mb-1", "position-relative", __default__.searchInputField), children: [
      searchSparkles.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: __default__.sparkle,
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__.searchPrepend, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsSearch, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          className: cx(__default__.searchInput, "form-control", "form-control-lg"),
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__.searchHelp, ref: searchHelpRef, children: /* @__PURE__ */ jsxRuntimeExports.jsx(HashLink, { to: "/about#searching", title: "Search Help", className: __default__.searchHelpLink, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaInfoCircle, { className: cx(__default__.searchHelpIcon, "text-muted") }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__.searchClear, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: cx(__default__.searchClearButton, "btn", "btn-link", "border-0"),
          title: "Clear Search Results",
          onClick: clearSearchResults,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsX, { className: __default__.searchClearIcon })
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
              __default__.miniTagAnimated,
              "btn",
              "mr-1"
            ),
            onClick: onSuggestionClick,
            "data-suggestion-type": "animated",
            children: "Animated"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: cx(__default__.miniTagEditorsChoice, "btn", "mr-1"),
            onClick: onSuggestionClick,
            "data-suggestion-type": "editorschoice",
            children: [
              "Editor's Choice ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(IoSparklesSharp, {})
            ]
          }
        ),
        tagsFragment
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: isDirectoryComplete ? `${searchResults.length} ${searchResults.length === 1 ? "result" : "results"}` : "…" }) })
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: __default__.searchInputLabel, htmlFor: "nsfwToggle", children: [
        "Show NSFW ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleSwitch, { id: "nsfwToggle", onToggle: onNsfwToggle })
      ] }) })
    ] })
  ] });
}
const PAGE_SIZE = 64;
function StickerPackListComponent() {
  const { searchResults, showNsfw, allStickerPacks, searchQuery, sortOrder, isDirectoryComplete } = React.useContext(Context);
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
  const isDefaultView = searchQuery.length === 0 && sortOrder === "";
  const showSpinner = allStickerPacks === void 0 || !isDefaultView && !isDirectoryComplete;
  if (showSpinner) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12 d-flex align-items-center justify-content-center py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "row", children: [
    renderedSearchResults.map((result) => {
      if (!result.item.meta.nsfw || result.item.meta.nsfw && showNsfw) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "col-6 col-md-4 col-lg-3 mb-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(PackCardLink, { stickerPack: result.item })
          },
          result.item.meta.id
        );
      }
      return null;
    }),
    !isDirectoryComplete && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12 d-flex justify-content-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {}) }),
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
      "Welcome to SignalStickers, the unofficial directory for Signal ",
      stickerPackLink,
      ". You can filter packs by title, author, or tags. No account needed!"
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchInputComponent, {}) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StickerPackListComponent, {})
  ] });
}
export {
  Home as default
};
//# sourceMappingURL=Home-BXLoT4_L.js.map
