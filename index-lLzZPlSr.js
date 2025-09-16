const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["Home-DmBMzQEk.js","vendor-BHPvmmhE.js","use-query-D-qmeKJI.js","assets/Home-CPey3KJv.css","StickerPackDetail-CkMWHFD2.js","assets/StickerPackDetail-KBr5LiUc.css","Contribute-wt4Kr7Ko.js","ContributionStatus-BxwuSdvo.js","About-BtoAZLs8.js","Report-Cpwx7_KG.js"])))=>i.map(i=>d[i]);
import { R as React, j as jsxRuntimeExports, o as omit, m as mapObjIndexed, c as cx, L as Link, B as BsList, N as NavLink, F as FiSun, a as FiMoon, S as SiKofi, b as BsBoxArrowUpRight, d as FaRss, e as FaGithub, f as curriedSaturate$1, g as curriedDarken$1, h as curriedLighten$1, u as useScrollPercentage, i as useAsyncEffect, p as pThrottle, k as Switch, l as Route, n as memoizeWith, q as identity, r as forEach, s as forEachObjIndexed, t as innerJoin, v as compose, w as uniqBy, x as filter, y as gte, z as propOr, A as Fuse, C as toPairs, D as values, E as join, G as prepend, H as path, I as split, J as type, K as detectWebpSupport, M as pQueue, O as pWaitFor, P as imageType, Q as find, T as test, U as LocalForage, V as getStickerInPack, W as pathEq, X as getStickerPackManifest, Y as axios, Z as prop, _ as map, $ as IconContext, a0 as BrowserRouter, a1 as render } from "./vendor-BHPvmmhE.js";
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
        onClick: collapseNavigation,
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
curriedDarken$1(0.1, "#6C757D");
curriedDarken$1(0.255, "#6C757D");
curriedLighten$1(0.18, "#6C757D");
const PRIMARY_DARKER = curriedDarken$1(0.15, "#007BFF");
const PRIMARY_LIGHTER = curriedLighten$1(0.2, "#007BFF");
curriedDarken$1(0.01, "#343A40");
var __default__ = { container: "ll2jjc0" };
const Home = React.lazy(async () => __vitePreload(() => import("./Home-DmBMzQEk.js"), true ? __vite__mapDeps([0,1,2,3]) : void 0));
const Pack = React.lazy(async () => __vitePreload(() => import("./StickerPackDetail-CkMWHFD2.js"), true ? __vite__mapDeps([4,1,2,5]) : void 0));
const Contribute = React.lazy(async () => __vitePreload(() => import("./Contribute-wt4Kr7Ko.js"), true ? __vite__mapDeps([6,1]) : void 0));
const ContributionStatus = React.lazy(async () => __vitePreload(() => import("./ContributionStatus-BxwuSdvo.js"), true ? __vite__mapDeps([7,1]) : void 0));
const About = React.lazy(async () => __vitePreload(() => import("./About-BtoAZLs8.js"), true ? __vite__mapDeps([8,1]) : void 0));
const Report = React.lazy(async () => __vitePreload(() => import("./Report-Cpwx7_KG.js"), true ? __vite__mapDeps([9,1]) : void 0));
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
const BASE_CONFIG = {
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  shouldSort: true,
  threshold: 0
};
const MAX_SCORE = 0.05;
const GENERAL_SEARCHER = Symbol("GENERAL");
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
const SEARCH_QUERY_PARAM = "s";
const SIGNAL_ART_URL_PATTERN = /^https:\/\/signal.art\/addstickers\/#pack_id=([\dA-Za-z]{32})&pack_key=([\dA-Za-z]{64})$/g;
const API_BASE_URL = "https://api.signalstickers.org/v1";
const API_URL_CONTRIBUTIONREQUEST = `${API_BASE_URL}/contributionrequest/`;
const API_URL_CONTRIBUTE = `${API_BASE_URL}/contribute/`;
const API_URL_PACKS = `${API_BASE_URL}/packs/`;
const API_URL_PACKS_PING = `${API_BASE_URL}/ping/`;
const API_URL_STATUS = `${API_BASE_URL}/packs/status/`;
const API_URL_REPORT = `${API_BASE_URL}/report/`;
let converter;
async function importWebpHero() {
  if (!converter) {
    converter = new Promise(async (resolve) => {
      const modules = await Promise.all([
        __vitePreload(() => import(
          /* webpackChunkName: "webp-hero" */
          "./vendor-BHPvmmhE.js"
        ).then((n) => n.aw), true ? [] : void 0),
        __vitePreload(() => import(
          /* webpackChunkName: "webp-hero-machine" */
          "./vendor-BHPvmmhE.js"
        ).then((n) => n.ax), true ? [] : void 0)
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
      navigator.sendBeacon(API_URL_PACKS_PING, beaconData);
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
const stickerPackCache = /* @__PURE__ */ new Map();
const stickerImageCache = LocalForage.createInstance({
  name: "Signal Stickers",
  storeName: "Image Cache"
});
async function getStickerPackDirectory() {
  if (!stickerPackDirectoryPromise) {
    stickerPackDirectoryPromise = axios.request({
      method: "GET",
      url: API_URL_PACKS
    }).then(prop("data"));
  }
  return stickerPackDirectoryPromise;
}
async function getStickerPack(id, key) {
  const cacheKey = key ? `${id}-${key}` : id;
  try {
    if (!stickerPackCache.has(cacheKey)) {
      const directory = await getStickerPackDirectory();
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
  const [searcher, setSearcher] = React.useState();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [showNsfw, setShowNsfw] = React.useState(false);
  useAsyncEffect(async () => {
    const stickerPacks = await getStickerPackDirectory();
    setAllStickerPacks(stickerPacks);
    setSearcher(SearchFactory({
      collection: stickerPacks,
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
    }));
  }, []);
  React.useEffect(() => {
    if (!allStickerPacks || !searcher) {
      return;
    }
    if (searchQuery.length === 0) {
      let orderedSearchResults = map((stickerPack) => ({
        item: stickerPack
      }), allStickerPacks);
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
      return;
    }
    setSearchResults(searcher.search(searchQuery));
  }, [
    allStickerPacks,
    searcher,
    searchQuery,
    sortOrder,
    showNsfw
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Context.Provider,
    {
      value: {
        allStickerPacks,
        searcher,
        searchQuery,
        searchResults,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        showNsfw,
        setShowNsfw
      },
      children: props.children
    }
  );
};
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
  API_URL_CONTRIBUTE as A,
  Context as C,
  ExternalLink as E,
  PRIMARY_DARKER as P,
  SEARCH_QUERY_PARAM as S,
  PRIMARY_LIGHTER as a,
  getStickerPack as b,
  SIGNAL_ART_URL_PATTERN as c,
  API_URL_CONTRIBUTIONREQUEST as d,
  getStickerPackDirectory as e,
  API_URL_STATUS as f,
  getConvertedStickerInPack as g,
  API_URL_REPORT as h,
  sendPackBeacon as s
};
//# sourceMappingURL=index-lLzZPlSr.js.map
