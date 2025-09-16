import { j as jsxRuntimeExports, S as SiKofi, b as BsBoxArrowUpRight } from "./vendor-BHPvmmhE.js";
import { E as ExternalLink } from "./index-lLzZPlSr.js";
const Example = ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children }) }) }) });
const Attr = ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-primary font-weight-bolder", children });
const Term = ({ children }) => /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-dark font-weight-bolder", children });
const SearchHelp = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "searching", className: "mb-4", children: "Advanced Searching" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-4", children: [
    "Generally, a search query will search across all indexed attributes of a sticker pack. These attributes are ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "title" }),
    ", ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "author" }),
    ", and ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "tags" }),
    ". It is also possible to perform a more targeted query that only searches on a specific attribute of a sticker pack. For instance, to search on just the ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "author" }),
    " attribute with the query ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Term, { children: "Sindre" }),
    ":"
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Example, { children: "author:Sindre" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-4", children: [
    "A search may be further refined by providing additional attribute clauses, each separated by a space. For example, to search for all packs whose ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "author" }),
    " contains the term ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Term, { children: "Sindre" }),
    " and that have a ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "tag" }),
    " containing the term ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Term, { children: "awesome" }),
    ":"
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Example, { children: "author:Sindre tag:awesome" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4", children: "If a search term contains spaces, it should be bracketed by double quotes:" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Example, { children: 'author:"Sindre is a horse" tag:awesome' }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-4", children: [
    "It is also possible to mix general search terms and attribute clauses. The following query will search for all packs whose ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "author" }),
    " contains the term ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Term, { children: "Sindre" }),
    ", and which have a tag containing the term ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Term, { children: "awesome" }),
    ", and which contain the term ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Term, { children: "unicorn" }),
    " in ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "any" }),
    " attribute:"
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Example, { children: "author:Sindre tag:awesome unicorn" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-4", children: [
    "Finally, you can filter by metadata. Supported metadata are ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "nsfw" }),
    ", ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "original" }),
    " and ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Attr, { children: "animated" }),
    ". For example, to search for all animated pack not-NSFW:"
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(Example, { children: "nsfw:false animated:true" })
] }) });
const TermsOfService = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "terms-of-service", className: "mb-4", children: "Terms of Service" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "signalstickers.org" }),
    ` is provided "as is". We try the best we can to keep it up and running, but we are volunteers, and we rely on third-parties, so we can't guarantee that `,
    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "signalstickers.org" }),
    " will be accessible at any time."
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
    "The inclusion, in whole or in part, of the ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "signalstickers.org" }),
    " website in any other application, website, or software is strictly forbidden."
  ] })
] }) });
const PrivacyPolicy = () => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "privacy-policy", className: "mb-4", children: "Privacy Policy" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "my-4", children: "What do we collect?" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
    "To provide statistics, we count the number of visitors on ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "signalstickers.org" }),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsxs(ExternalLink, { href: "https://gist.github.com/romainricard/7ac34b6ea34a58f6c98087ae9aadfbc0", children: [
      "in a way that does ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "not" }),
      " log your IP address"
    ] }),
    ", so our statistics are anonymous."
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "signalstickers.org" }),
    " interface is hosted on ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { href: "https://pages.github.com/", children: "GitHub Pages" }),
    ", and we use third-party scripts, which might collect your IP address. Our API server is cached by Cloudflare, which might collect your IP address."
  ] }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "my-4", children: "What don't we collect?" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "All the rest. We don't use cookies, we don't use Google Analytics, and we don't track you as you visit any other site." }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("h5", { className: "my-4", children: "What data do we sell?" }),
  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "None" }),
    ", as 1. we are an open-source project that values privacy, and 2. we don't collect any personal data about you in the first place."
  ] })
] }) });
const Links = () => {
  const externalLinks = [{
    name: "Learn more about Signal",
    href: "https://signal.org"
  }, {
    name: "Sticker pack creation guide",
    href: "https://support.signal.org/hc/articles/360031836512-Stickers#h_c2a0a45b-862f-4d12-9ab1-d9a6844062ca"
  }, {
    name: "Report an Issue",
    href: "https://github.com/signalstickers/signalstickers/issues/new"
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-4", children: "Links" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "list-unstyled", children: externalLinks.map(({ name, href }) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ExternalLink, { href, title: name, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BsBoxArrowUpRight, { className: "mr-1" }),
      name
    ] }) }, href)) })
  ] });
};
function AboutComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-4 p-lg-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "row", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { id: "about", className: "mb-4", children: "About" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Signal Stickers is a community-organized, unofficial directory of sticker packs for Signal, the secure messenger. All content on this website is copyrighted by their respective owners. This website is ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "not affiliated with Signal" }),
        " or Open Whisper Systems."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Signal Stickers is free and open-source. You can support us and help pay hosting fees by",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ExternalLink, { href: "https://ko-fi.com/signalstickers", title: "Donate on Ko-Fi!", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SiKofi, { className: "d-none d-md-inline" }),
          " donating on Ko-Fi."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "my-5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Links, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "my-5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SearchHelp, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "my-5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TermsOfService, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "my-5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PrivacyPolicy, {})
  ] });
}
export {
  AboutComponent as default
};
//# sourceMappingURL=About-BtoAZLs8.js.map
