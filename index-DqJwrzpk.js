const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["Home-BXLoT4_L.js","vendor-Ccogie0v.js","PackCardLink-BUg6wfbQ.js","assets/PackCardLink-Cay3Ea-Y.css","LoadingSpinner-FN5mVXsc.js","assets/Home-CYTaEnSW.css","StickerPackDetail--XAf9VW-.js","assets/StickerPackDetail-BP_exJah.css","Contribute-CIeJSBJD.js","ContributionStatus-DRxca2HC.js","About--_SEqvEu.js","Report-DSb1TV8j.js"])))=>i.map(i=>d[i]);
import { R as React, j as jsxRuntimeExports, o as omit, m as mapObjIndexed, a as memoizeWith, f as forEach, b as forEachObjIndexed, i as innerJoin, c as identity, d as compose, u as uniqBy, e as filter, g as gte, p as propOr, t as toPairs, F as Fuse, v as values, h as join, k as prepend, l as path, s as split, n as type, q as detectWebpSupport, r as pQueue, w as pWaitFor, x as imageType, y as find, z as test, L as LocalForage, A as getStickerInPack, B as pathEq, C as getStickerPackManifest, D as useAsyncEffect, E as map, G as Link, H as BsList, N as NavLink, I as FiSun, J as FiMoon, K as cx, S as SiKofi, M as BsBoxArrowUpRight, O as FaRss, P as FaGithub, Q as curriedSaturate$1, T as curriedDarken$1, U as curriedLighten$1, V as useScrollPercentage, W as pThrottle, X as Switch, Y as Route, Z as IconContext, _ as BrowserRouter, $ as render } from "./vendor-Ccogie0v.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    let allSettled = function(promises$2) {
      return Promise.all(promises$2.map((p) => Promise.resolve(p).then((value$1) => ({
        status: "fulfilled",
        value: value$1
      }), (reason) => ({
        status: "rejected",
        reason
      }))));
    };
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = allSettled(deps.map((dep) => {
      dep = assetsURL(dep);
      if (dep in seen) return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) link.as = "script";
      link.crossOrigin = "";
      link.href = dep;
      if (cspNonce) link.setAttribute("nonce", cspNonce);
      document.head.appendChild(link);
      if (isCss) return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
      });
    }));
  }
  function handlePreloadError(err$2) {
    const e$1 = new Event("vite:preloadError", { cancelable: true });
    e$1.payload = err$2;
    window.dispatchEvent(e$1);
    if (!e$1.defaultPrevented) throw err$2;
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
const signalStickersLogoUrl = "/assets/favicon-DgO9o1NW.png";
const ExternalLink = React.memo(React.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "a",
  {
    target: "_blank",
    rel: "noreferrer noopener",
    ref,
    ...omit(["children", "ref"], props),
    children: props.children
  }
)));
ExternalLink.displayName = "ExternalLink";
const initialState = {
  darkMode: false
};
const Context$1 = React.createContext({});
function Provider$1(props) {
  const initializer = (initialState2) => {
    return mapObjIndexed((initialValue, key) => {
      try {
        return JSON.parse(localStorage.getItem(key) ?? initialValue);
      } catch {
        return initialValue;
      }
    }, initialState2);
  };
  const reducer = (state2, action) => {
    try {
      localStorage.setItem(String(action.key), JSON.stringify(action.value));
    } catch {
    }
    return { ...state2, [action.key]: action.value };
  };
  const [state, dispatch] = React.useReducer(reducer, initialState, initializer);
  function useAppState(key) {
    const setState = (value) => {
      dispatch({ key, value });
    };
    return [state[key], setState];
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Context$1.Provider, { value: useAppState, children: props.children });
}
const SEARCH_QUERY_PARAM = "s";
const SIGNAL_ART_URL_PATTERN = /^https:\/\/signal.art\/addstickers\/#pack_id=([\dA-Za-z]{32})&pack_key=([\dA-Za-z]{64})$/g;
const INITIAL_PACKS_LIMIT = 128;
const API_BASE_URL = "https://api.signalstickers.org/v2";
const API_URL_PACKS = `${API_BASE_URL}/packs`;
const API_URL_SECURITY_QUESTION = `${API_BASE_URL}/security-question`;
const API_URL_STATUS = `${API_BASE_URL}/packs/status`;
const API_URL_REPORT = `${API_BASE_URL}/packs/report`;
const API_URL_ANALYTICS = `${API_BASE_URL}/analytics`;
const BASE_CONFIG = {
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  shouldSort: true,
  threshold: 0
};
const MAX_SCORE = 0.05;
const GENERAL_SEARCHER = /* @__PURE__ */ Symbol("GENERAL");
const QUOTED_EXPRESSION_PATTERN = /(?<attribute>[^\s":]+):"(?<query>[^":]+)"/g;
const UNQUOTED_EXPRESSION_PATTERN = /(?<attribute>[^\s":]+):(?<query>[^\s":]+)/g;
function SearchFactory(options) {
  const searchers = /* @__PURE__ */ new Map();
  const customGetFn = (item, path$1) => {
    const value = path(Array.isArray(path$1) ? path$1 : split(".", path$1), item);
    const valueType = type(value);
    switch (valueType) {
      case "String":
        return String(value);
      case "Array":
        return value;
      // Cast booleans and numbers using the String constructor, yielding
      // results like 'true', 'false'.
      case "Boolean":
      case "Number":
        return String(value);
      // For bottom values, return 'false'. This allows queries on attributes
      // where the absence of that attribute implies `false`, such as 'nsfw' and
      // 'original'.
      case "Null":
      case "Undefined":
        return "false";
      default:
        throw new Error(`[Search::getFn] Unable to parse value of type "${valueType}" at path "${String(path$1)}".`);
    }
  };
  const wordCount = (input) => input.split(/\s+/g).length;
  const processResults = (results) => {
    return compose(
      // Filter-out results with a score above MAX_SCORE.
      filter(compose(gte(MAX_SCORE), propOr(void 0, "score"))),
      // De-dupe results by calling the configured identity callback.
      uniqBy((result) => options.identity(result.item))
    )(results);
  };
  const createFuseInstances = (collection) => {
    forEach(([attribute, path2]) => {
      searchers.set(attribute, new Fuse(collection, {
        ...BASE_CONFIG,
        getFn: customGetFn,
        keys: [path2]
      }));
    }, toPairs(options.keys ?? []));
    searchers.set(GENERAL_SEARCHER, new Fuse(collection, {
      ...BASE_CONFIG,
      getFn: customGetFn,
      keys: values(options.keys)
    }));
  };
  const parseQueryString = (query) => {
    let remainingQuery = query;
    const attributeQueries = [];
    forEach((curPattern) => {
      if (remainingQuery.length === 0) {
        return;
      }
      forEach((match) => {
        if (!match.groups) {
          return;
        }
        const attribute = match.groups.attribute.trim();
        const query2 = match.groups.query.trim();
        const isValidAttribute = searchers.has(attribute);
        if (!isValidAttribute) {
          return;
        }
        remainingQuery = remainingQuery.replace(match[0], "").trim();
        attributeQueries.push({ [attribute]: query2 });
      }, [...remainingQuery.matchAll(curPattern)]);
    }, [
      UNQUOTED_EXPRESSION_PATTERN,
      QUOTED_EXPRESSION_PATTERN
    ]);
    return {
      query: remainingQuery.trim(),
      attributeQueries
    };
  };
  const buildQueryString = (queryObject) => {
    const queryTerms = [];
    forEach(forEachObjIndexed((query, attribute) => {
      const isValidAttribute = searchers.has(attribute);
      if (!isValidAttribute) {
        throw new Error(`[Search::buildQueryString] Unknown attribute: "${attribute}".`);
      }
      const formattedQuery = wordCount(query) > 1 ? `"${query}"` : query;
      queryTerms.push(`${attribute}:${formattedQuery}`);
    }), queryObject.attributeQueries ?? []);
    return join(" ", prepend(queryObject.query, queryTerms)).trim();
  };
  const search = memoizeWith(identity, (queryString) => {
    let results = [];
    const { query, attributeQueries } = parseQueryString(queryString);
    forEach(forEachObjIndexed((attributeQuery, attribute) => {
      if (!attributeQuery) {
        return;
      }
      const searcherForAttribute = searchers.get(attribute);
      if (!searcherForAttribute) {
        return;
      }
      const resultsForAttribute = searcherForAttribute.search(attributeQuery);
      if (results.length === 0) {
        results = resultsForAttribute;
      } else {
        results = innerJoin((a, b) => {
          return options.identity(a.item) === options.identity(b.item);
        }, results, resultsForAttribute);
      }
    }), attributeQueries ?? []);
    if (query) {
      const querySearcher = searchers.get(GENERAL_SEARCHER);
      if (querySearcher) {
        const queryResults = querySearcher.search(query);
        results = results.length === 0 ? queryResults : innerJoin((a, b) => {
          return options.identity(a.item) === options.identity(b.item);
        }, results, queryResults);
      } else {
        throw new Error("[Search] Unable to find the generic searcher.");
      }
    }
    return processResults(results);
  });
  createFuseInstances(options.collection);
  return {
    search,
    parseQueryString,
    buildQueryString
  };
}
class ApiError extends Error {
  status;
  details;
  type;
  msg;
  constructor(status, details) {
    super(details[0]?.msg ?? `Request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.type = details[0]?.type ?? "";
    this.msg = details[0]?.msg ?? "";
  }
}
function errorFieldPath(err) {
  const loc = err.details[0]?.loc;
  if (!loc) {
    return void 0;
  }
  const dataIdx = loc.findIndex((part) => part === "data");
  if (dataIdx === -1 || dataIdx === loc.length - 1) {
    return void 0;
  }
  return loc.slice(dataIdx + 1).join(".");
}
async function request(path2, init = {}) {
  const headers = new Headers({ Accept: "application/json" });
  new Headers(init.headers).forEach((value, key) => {
    headers.set(key, value);
  });
  const response = await fetch(path2, {
    ...init,
    headers
  });
  if (response.status === 204) {
    return void 0;
  }
  const body = await response.json().catch(() => void 0);
  if (!response.ok) {
    throw new ApiError(response.status, body?.detail ?? []);
  }
  return body;
}
function getPacks(limit) {
  const query = limit != null ? `?limit=${limit}` : "";
  return request(`${API_URL_PACKS}${query}`);
}
function getSecurityQuestion() {
  return request(API_URL_SECURITY_QUESTION, { method: "POST" });
}
function contributePack(payload) {
  return request(API_URL_PACKS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
function getPackStatus(id, key) {
  const query = new URLSearchParams({ id, key }).toString();
  return request(`${API_URL_STATUS}?${query}`);
}
function reportPack(payload) {
  return request(API_URL_REPORT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}
let converter;
async function importWebpHero() {
  if (!converter) {
    converter = new Promise(async (resolve) => {
      const modules = await Promise.all([
        __vitePreload(() => import(
          /* webpackChunkName: "webp-hero" */
          "./vendor-Ccogie0v.js"
        ).then((n) => n.av), true ? [] : void 0),
        __vitePreload(() => import(
          /* webpackChunkName: "webp-hero-machine" */
          "./vendor-Ccogie0v.js"
        ).then((n) => n.aw), true ? [] : void 0)
      ]);
      const { Webp } = modules[0];
      const { WebpMachine, defaultDetectWebpImage } = modules[1];
      const webp = new Webp();
      webp.Module.doNotCaptureKeyboard = true;
      resolve(new WebpMachine({
        webp,
        webpSupport: detectWebpSupport(),
        detectWebpImage: defaultDetectWebpImage
      }));
    });
  }
  return converter;
}
const hasWebpSupportPromise = detectWebpSupport();
const imageConversionQueue = new pQueue({ concurrency: 1 });
function getImageMimeType(rawImageData) {
  const typeInfo = imageType(rawImageData);
  if (!typeInfo) {
    throw new Error("[getImageMimeType] Unable to determine MIME type of image.");
  }
  return typeInfo.mime;
}
function uInt8ToBase64(data) {
  let strData = "";
  for (const byte of data) {
    strData += String.fromCharCode(byte);
  }
  return btoa(strData);
}
async function convertImage(rawImageData) {
  const mimeType = getImageMimeType(rawImageData);
  const hasWebpSupport = await hasWebpSupportPromise;
  if (mimeType === "image/webp" && !hasWebpSupport) {
    return imageConversionQueue.add(async () => {
      try {
        const converter2 = await importWebpHero();
        await pWaitFor(() => converter2.busy === false);
        return await converter2.decode(rawImageData);
      } catch (err) {
        console.error(`[convertImage] Image conversion failed: ${err.message}`);
        throw err;
      }
    });
  }
  return `data:${mimeType};base64,${uInt8ToBase64(rawImageData)}`;
}
class ErrorWithCode extends Error {
  code;
  constructor(code, message) {
    super(message);
    this.code = code ?? "UNKNOWN";
  }
  static from = (code, err) => {
    const errWithCode = new ErrorWithCode(code, err.message);
    errWithCode.stack = err.stack;
    return errWithCode;
  };
}
async function printStorageUsage() {
}
function sendPackBeacon(packId) {
  {
    try {
      const beaconData = new Blob([`target=${packId}`], { type: "application/x-www-form-urlencoded" });
      navigator.sendBeacon(API_URL_ANALYTICS, beaconData);
    } catch (err) {
      console.log(`${err}. No worries, it's okay!`);
    }
  }
}
function sendHomeBeacon() {
  sendPackBeacon("home");
}
function isStorageUnavailableError(err) {
  const patterns = [
    // Firefox in private mode.
    /the quota has been exceeded/gi
  ];
  if (err?.message) {
    return Boolean(find((curPattern) => test(curPattern, err.message), patterns));
  }
  return false;
}
let stickerPackDirectoryPromise;
let stickerPackDirectoryLimitedPromise;
let stickerPackDirectoryLimited;
const stickerPackCache = /* @__PURE__ */ new Map();
const stickerImageCache = LocalForage.createInstance({
  name: "Signal Stickers",
  storeName: "Image Cache"
});
async function getStickerPackDirectory() {
  if (!stickerPackDirectoryPromise) {
    stickerPackDirectoryPromise = getPacks();
  }
  return stickerPackDirectoryPromise;
}
function getStickerPackDirectoryLimited(limit) {
  if (!stickerPackDirectoryLimitedPromise) {
    stickerPackDirectoryLimitedPromise = getPacks(limit).then((packs) => {
      stickerPackDirectoryLimited = packs;
      return packs;
    });
  }
  return stickerPackDirectoryLimitedPromise;
}
async function getDirectoryForPack(id) {
  if (stickerPackDirectoryLimited && find(pathEq(id, ["meta", "id"]), stickerPackDirectoryLimited)) {
    return stickerPackDirectoryLimited;
  }
  return getStickerPackDirectory();
}
async function getStickerPack(id, key) {
  const cacheKey = key ? `${id}-${key}` : id;
  try {
    if (!stickerPackCache.has(cacheKey)) {
      const directory = await getDirectoryForPack(id);
      const partial = find(pathEq(id, ["meta", "id"]), directory);
      const finalKey = partial?.meta.key ?? key;
      if (!finalKey) {
        throw new ErrorWithCode("NO_KEY_PROVIDED", `No key provided for unlisted pack: ${id}.`);
      }
      const meta = partial ? {
        ...partial.meta,
        unlisted: false
      } : {
        id,
        key: finalKey,
        unlisted: true
      };
      const manifest = await getStickerPackManifest(id, finalKey);
      const stickerPack = {
        meta,
        manifest
      };
      stickerPackCache.set(cacheKey, stickerPack);
    }
    return stickerPackCache.get(cacheKey);
  } catch (err) {
    if (err.isAxiosError && err.response.status === 403) {
      throw new ErrorWithCode("MANIFEST_DECRYPT", `[getStickerPack] ${err.stack}`);
    }
    throw new ErrorWithCode(err.code, `[getStickerPack] ${err.stack}`);
  }
}
async function getConvertedStickerInPack(id, key, stickerId) {
  let convertedImage = "";
  try {
    const cacheKey = `${id}-${stickerId}`;
    const imageFromCache = await stickerImageCache.getItem(cacheKey);
    if (!imageFromCache) {
      const rawImageData = await getStickerInPack(id, key, stickerId);
      convertedImage = await convertImage(rawImageData);
      await stickerImageCache.setItem(cacheKey, convertedImage);
      return convertedImage;
    }
    return await stickerImageCache.getItem(cacheKey);
  } catch (err) {
    if (!isStorageUnavailableError(err)) {
      throw new Error(`[getConvertedStickerInPack] Error getting sticker: ${err.message}`);
    }
  }
  return convertedImage;
}
const Context = React.createContext({});
const Provider = (props) => {
  const [allStickerPacks, setAllStickerPacks] = React.useState();
  const [isDirectoryComplete, setIsDirectoryComplete] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [showNsfw, setShowNsfw] = React.useState(false);
  const searcher = React.useMemo(() => SearchFactory({
    collection: allStickerPacks ?? [],
    identity: path(["meta", "id"]),
    keys: {
      title: ["manifest", "title"],
      author: ["manifest", "author"],
      tag: ["meta", "tags"],
      nsfw: ["meta", "nsfw"],
      original: ["meta", "original"],
      animated: ["meta", "animated"],
      editorschoice: ["meta", "editorschoice"]
    }
  }), [allStickerPacks]);
  const hasEditorsChoiceFilter = React.useMemo(() => {
    if (searchQuery.length === 0) {
      return false;
    }
    const parsed = searcher.parseQueryString(searchQuery);
    return parsed.attributeQueries?.some(
      (aq) => aq.editorschoice === "true"
    ) ?? false;
  }, [searcher, searchQuery]);
  useAsyncEffect(async () => {
    const fullPromise = getStickerPackDirectory().catch((err) => {
      console.error("[StickersContext] Failed to load full sticker pack directory", err);
      return void 0;
    });
    const limited = await getStickerPackDirectoryLimited(INITIAL_PACKS_LIMIT);
    setAllStickerPacks(limited);
    const full = await fullPromise;
    if (full) {
      setAllStickerPacks(full);
    }
    setIsDirectoryComplete(true);
  }, []);
  React.useEffect(() => {
    const isDefaultView = searchQuery.length === 0 && sortOrder === "";
    if (isDefaultView) {
      setSearchResults(allStickerPacks ? map((stickerPack) => ({ item: stickerPack }), allStickerPacks) : []);
      return;
    }
    if (!isDirectoryComplete || !allStickerPacks) {
      return;
    }
    if (searchQuery.length > 0) {
      setSearchResults(searcher.search(searchQuery));
      return;
    }
    let orderedSearchResults = map((stickerPack) => ({ item: stickerPack }), allStickerPacks);
    let sortKey = "";
    switch (sortOrder) {
      case "trending":
        sortKey = "hotviews";
        break;
      case "mostViewed":
        sortKey = "totalviews";
        break;
    }
    if (sortKey) {
      orderedSearchResults = orderedSearchResults.sort((a, b) => (a.item.meta[sortKey] ?? 0) > (b.item.meta[sortKey] ?? 0) ? -1 : 1);
    }
    setSearchResults(orderedSearchResults);
  }, [
    allStickerPacks,
    searcher,
    searchQuery,
    sortOrder,
    showNsfw,
    isDirectoryComplete
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Context.Provider,
    {
      value: {
        allStickerPacks,
        isDirectoryComplete,
        searcher,
        searchQuery,
        searchResults,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        showNsfw,
        setShowNsfw,
        hasEditorsChoiceFilter
      },
      children: props.children
    }
  );
};
var __default__$1 = { navbar: "myh45u0" };
const navLinks = [{
  title: "Contribute",
  href: "/contribute"
}, {
  title: "About",
  href: "/about"
}, {
  title: "Help Signalstickers to stay alive!",
  href: "https://ko-fi.com/signalstickers",
  external: true,
  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SiKofi, { className: "d-none d-md-inline" }),
    " Donate",
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "d-md-none", children: [
      " on Ko-Fi ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(BsBoxArrowUpRight, {})
    ] })
  ] })
}, {
  title: "RSS",
  href: "https://api.signalstickers.org/feed/rss/",
  external: true,
  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "d-md-none", children: [
      "RSS ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(BsBoxArrowUpRight, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FaRss, { className: "d-none d-md-inline" })
  ] })
}, {
  title: "GitHub Repository",
  href: "https://github.com/signalstickers/signalstickers",
  external: true,
  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "d-md-none", children: [
      "GitHub ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(BsBoxArrowUpRight, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FaGithub, { className: "d-none d-md-inline" })
  ] })
}];
const NAVBAR_TOGGLE_ID = "navbar-toggle";
function NavbarComponent() {
  const useAppState = React.useContext(Context$1);
  const [darkMode, setDarkMode] = useAppState("darkMode");
  const { setSearchQuery } = React.useContext(Context);
  const toggleDarkMode = React.useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode]);
  const collapseNavigation = React.useCallback(() => {
    $(`#${NAVBAR_TOGGLE_ID}`).collapse("hide");
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: cx(__default__$1.navbar, "navbar navbar-expand-md navbar-dark"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/",
        className: "navbar-brand",
        onClick: () => {
          collapseNavigation();
          setSearchQuery("");
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: signalStickersLogoUrl, alt: "Signal Stickers Logo" }),
          " Signal Stickers"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "navbar-toggler",
        "data-toggle": "collapse",
        "data-target": `#${NAVBAR_TOGGLE_ID}`,
        "aria-controls": NAVBAR_TOGGLE_ID,
        "aria-expanded": "false",
        "aria-label": "Toggle Navigation",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(BsList, { className: "menu-icon" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { id: NAVBAR_TOGGLE_ID, className: "collapse navbar-collapse", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "navbar-nav ml-auto mt-2 mt-md-0 pb-xs-0", children: [
      navLinks.map((navLink) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "nav-item", children: navLink.external ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ExternalLink,
        {
          href: navLink.href,
          title: navLink.title,
          className: "nav-link py-3 py-md-2",
          children: navLink.children ?? navLink.title
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavLink,
        {
          to: navLink.href,
          title: navLink.title,
          className: "nav-link py-3 py-md-2",
          activeClassName: "active",
          onClick: collapseNavigation,
          children: navLink.children ?? navLink.title
        }
      ) }, navLink.href)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "nav-item", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "btn btn-link nav-link py-3 py-md-2",
          title: "Dark Mode",
          onClick: toggleDarkMode,
          children: darkMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "d-inline-block d-md-none mr-1", children: "Light mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FiSun, {})
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "d-inline-block d-md-none mr-1", children: "Dark mode" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FiMoon, {})
          ] })
        }
      ) })
    ] }) })
  ] }) });
}
function SuspenseFallback() {
  const [showSpinner, setShowSpinner] = React.useState(false);
  const SPINNER_DELAY = 2e3;
  React.useEffect(() => {
    const timeoutHandle = setTimeout(() => {
      setShowSpinner(true);
    }, SPINNER_DELAY);
    return () => {
      clearTimeout(timeoutHandle);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "d-flex align-items-center justify-content-center flex-grow-1", children: showSpinner && /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "spinner-border",
      role: "status",
      style: {
        borderWidth: "2px",
        color: "rgba(0, 0, 0, 0.5)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Loading..." })
    }
  ) });
}
curriedSaturate$1(0.2, "#DC3545");
const SPARKLE_GOLD = "218, 165, 32";
curriedDarken$1(0.1, "#6C757D");
curriedDarken$1(0.255, "#6C757D");
curriedLighten$1(0.18, "#6C757D");
const PRIMARY_DARKER = curriedDarken$1(0.15, "#007BFF");
const PRIMARY_LIGHTER = curriedLighten$1(0.2, "#007BFF");
curriedDarken$1(0.01, "#343A40");
var __default__ = { container: "ll2jjc0" };
const Home = React.lazy(async () => __vitePreload(() => import("./Home-BXLoT4_L.js"), true ? __vite__mapDeps([0,1,2,3,4,5]) : void 0));
const Pack = React.lazy(async () => __vitePreload(() => import("./StickerPackDetail--XAf9VW-.js"), true ? __vite__mapDeps([6,1,2,3,7]) : void 0));
const Contribute = React.lazy(async () => __vitePreload(() => import("./Contribute-CIeJSBJD.js"), true ? __vite__mapDeps([8,1,4]) : void 0));
const ContributionStatus = React.lazy(async () => __vitePreload(() => import("./ContributionStatus-DRxca2HC.js"), true ? __vite__mapDeps([9,1]) : void 0));
const About = React.lazy(async () => __vitePreload(() => import("./About--_SEqvEu.js"), true ? __vite__mapDeps([10,1]) : void 0));
const Report = React.lazy(async () => __vitePreload(() => import("./Report-DSb1TV8j.js"), true ? __vite__mapDeps([11,1]) : void 0));
function AppLayout() {
  const useAppState = React.useContext(Context$1);
  const [darkMode] = useAppState("darkMode");
  const [ref, percentage] = useScrollPercentage();
  React.useEffect(() => {
    const bodyEl = document.querySelector("body");
    if (!bodyEl) {
      return;
    }
    if (darkMode) {
      bodyEl.classList.add("theme-dark");
      bodyEl.classList.remove("theme-light");
    } else {
      bodyEl.classList.add("theme-light");
      bodyEl.classList.remove("theme-dark");
    }
  }, [darkMode]);
  useAsyncEffect(pThrottle(() => {
    const bodyEl = document.querySelector("body");
    if (!bodyEl) {
      return;
    }
    if (darkMode) {
      bodyEl.style.backgroundColor = percentage < 0.5 ? PRIMARY_DARKER : "var(--dark)";
    } else {
      bodyEl.style.backgroundColor = percentage < 0.5 ? "var(--primary)" : "var(--white)";
    }
  }, 10, 1e3), [percentage, darkMode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(NavbarComponent, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: __default__.container, ref, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container d-flex flex-column flex-grow-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(React.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx(SuspenseFallback, {}), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Switch, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { exact: true, path: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Home, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/pack/:packId/report", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Report, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/pack/:packId", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pack, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/contribute", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Contribute, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/contribution-status", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContributionStatus, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/about", children: /* @__PURE__ */ jsxRuntimeExports.jsx(About, {}) })
    ] }) }) }) })
  ] });
}
function App() {
  sendHomeBeacon();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    IconContext.Provider,
    {
      value: {
        className: "icon",
        style: {
          lineHeight: "1em",
          verticalAlign: "-0.125em",
          minHeight: "1em",
          minWidth: "1em"
        }
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Provider$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Provider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(BrowserRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppLayout, {}) }) }) })
    }
  ) });
}
void printStorageUsage();
render("#root", /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}));
export {
  ApiError as A,
  Context as C,
  ExternalLink as E,
  PRIMARY_DARKER as P,
  SPARKLE_GOLD as S,
  PRIMARY_LIGHTER as a,
  SEARCH_QUERY_PARAM as b,
  getStickerPack as c,
  SIGNAL_ART_URL_PATTERN as d,
  getSecurityQuestion as e,
  contributePack as f,
  getConvertedStickerInPack as g,
  errorFieldPath as h,
  getStickerPackDirectory as i,
  getPackStatus as j,
  reportPack as r,
  sendPackBeacon as s
};
//# sourceMappingURL=index-DqJwrzpk.js.map
