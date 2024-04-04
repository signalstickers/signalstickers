import React from 'react';
import { BsBoxArrowUpRight, BsInfoCircleFill } from 'react-icons/bs';
import { SiKofi } from 'react-icons/si';

import ExternalLink from 'components/general/ExternalLink';
import InlineCode from 'components/general/InlineCode';


// Various links used in copy, defined here to make copy easier to read/edit.
const links = {
  donate: (
    <ExternalLink
      href="https://ko-fi.com/signalstickers"
      title="Donate on Ko-Fi!"
    >
      <SiKofi
        className="d-none d-md-inline"
        style={{ transform: 'translateY(1px)' }}
      />&nbsp;donating on Ko-Fi
    </ExternalLink>
  ),
  makePrivacyStick: (
    <ExternalLink
      href="https://twitter.com/search?q=%23makeprivacystick&src=typed_query"
    >
      <span className="fw-bold">#makeprivacystick</span>
    </ExternalLink>
  ),
  fuzzySearch: (
    <ExternalLink
      href="https://en.wikipedia.org/wiki/Approximate_string_matching"
    >fuzzy search</ExternalLink>
  ),
  noTrack: (
    <ExternalLink
      href="https://gist.github.com/romainricard/7ac34b6ea34a58f6c98087ae9aadfbc0"
    >source</ExternalLink>
  ),
  githubPages: (
    <ExternalLink
      href="https://pages.github.com/"
    >GitHub Pages</ExternalLink>
  )
};


// ----- About -----------------------------------------------------------------

const AboutSection = () => (
  <div className="row">
    <div className="col-12">
      <h1 id="about" className="mb-4">About</h1>
      <p>
        Signal Stickers is a community-organized, unofficial directory of sticker packs for Signal,
        the secure messenger. All content on this website is copyrighted by their respective owners.
        This website is <b>not affiliated with Signal</b> or Open Whisper Systems.
      </p>
      <p>
        Signal Stickers is free and open-source. You can support us and help pay hosting fees
        by {links.donate}.
      </p>
      <p>
        {links.makePrivacyStick}
      </p>
    </div>
  </div>
);


// ----- Links -----------------------------------------------------------------

const Links = () => {
  const externalLinks = [{
    name: 'Learn more about Signal',
    href: 'https://signal.org'
  }, {
    name: 'Sticker pack creation guide',
    href: 'https://support.signal.org/hc/en-us/articles/360031836512-Stickers#sticker_creator_steps'
  }, {
    name: 'Report an Issue',
    href: 'https://github.com/signalstickers/signalstickers/issues/new'
  }];

  return (
    <div className="pb-1">
      <h1 className="mb-4">Links</h1>
      <ul className="list-unstyled">
        {externalLinks.map(({ name, href }) => (
          <li className="mb-2" key={href}>
            <ExternalLink href={href} title={name}>
              <BsBoxArrowUpRight className="me-2" />
              {name}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </div>
  );
};


// ----- Search Help -----------------------------------------------------------

const Example = ({ children }: React.PropsWithChildren) => (
  <div className="card mb-4">
    <div className="card-body px-3 py-2">
      <pre className="mb-0 fs-5"><code>{children}</code></pre>
    </div>
  </div>
);


const SearchHelp = () => (
  <div className="row">
    <div className="col-12">
      <h1 id="searching" className="mb-4">Advanced Searching</h1>
      <p className="mb-4">
        Generally, a search query will perform a {links.fuzzySearch} on all attributes of a sticker
        pack. These attributes are: <InlineCode>title</InlineCode>, <InlineCode>author</InlineCode>,
        and <InlineCode>tags</InlineCode>. It is also possible to perform a more targeted query that
        only searches on a specific attribute of a sticker pack. For instance, to search on just
        the <InlineCode>author</InlineCode> attribute with the query <InlineCode>Sindre</InlineCode>:
      </p>
      <Example>author:Sindre</Example>
      <p className="mb-4">
        A search may be further refined by providing additional attribute clauses, each separated by a
        space. For example, to search for all packs whose <InlineCode>author</InlineCode> matches
        {' '}<InlineCode>Sindre</InlineCode> and have a <InlineCode>tag</InlineCode> matching
        {' '}<InlineCode>awesome</InlineCode>:
      </p>
      <Example>author:Sindre tag:awesome</Example>
      <p className="mb-4">
        If a search term contains spaces, it should be bracketed by double quotes:
      </p>
      <Example>author:"Sindre is a horse" tag:awesome</Example>
      <p className="mb-4">
        It is also possible to mix general search terms and attribute clauses. The following query will
        search for all packs whose <InlineCode>author</InlineCode> matches the term <InlineCode>Sindre</InlineCode>,
        and which have a tag matching the term <InlineCode>awesome</InlineCode>, and which match the
        term <InlineCode>unicorn</InlineCode> on <em>any</em> attribute:
      </p>
      <Example>author:Sindre tag:awesome unicorn</Example>
      <p className="mb-4">
        Sticker packs also contain attributes that are either <InlineCode>true</InlineCode> or
        {' '}<InlineCode>false</InlineCode>. These attributes are: <InlineCode>original</InlineCode>,
        {' '}<InlineCode>animated</InlineCode>, and <InlineCode>nsfw</InlineCode>. To search for all
        animated packs that are not NSFW:
      </p>
      <Example>animated:true nsfw:false</Example>
      <div className="alert alert-primary d-flex gap-3 mb-4">
        <BsInfoCircleFill className="mt-2" />
        <p className="m-0">
          Remember that fuzzy searching means that search results may contain items that do not exactly
          match a query. Results are scored based on how closely they match a query, and when sorting by
          {' '}<InlineCode className="text-info-emphasis">Relevance</InlineCode>, results are sorted by score.
        </p>
      </div>
    </div>
  </div>
);


// ----- Terms of Service ------------------------------------------------------

const TermsOfService = () => (
  <div className="row">
    <div className="col-12">
      <h1 id="terms-of-service" className="mb-4">Terms of Service</h1>
      <p>
        Signal Stickers is provided "as is". We try the best we can to keep it up and running, but we
        are volunteers, and we rely on third-parties, so we can't guarantee that the
        {' '}<InlineCode>signalstickers.org</InlineCode> will be accessible at any time.
      </p>
      <p>
        The inclusion, in whole or in part, of the <InlineCode>signalstickers.org</InlineCode> website
        in any other application, website, or software is strictly forbidden.
      </p>
    </div>
  </div>
);


// ----- Privacy Policy --------------------------------------------------------

const PrivacyPolicy = () => (
  <div className="row">
    <div className="col-12">
      <h1 id="privacy-policy" className="mb-4">Privacy Policy</h1>
      <h4 className="my-4">What data we do collect:</h4>
      <ul>
        <li>
          To provide statistics, we count the number of visitors on <InlineCode>signalstickers.org</InlineCode>
          {' '}in a way that does not track your IP address, so our statistics are anonymous. ({links.noTrack})
        </li>
        <li>
          The <InlineCode>signalstickers.org</InlineCode> website is hosted on {links.githubPages}. We
          do not use any third-party scripts or assets. However, our API server is cached by Cloudflare,
          which might collect your IP address.
        </li>
      </ul>
      <h4 className="my-4">What data we don't collect:</h4>
      <p>
        All the rest. We don't use cookies, we don't use Google Analytics, and we don't track you as you
        visit any other site.
      </p>
      <h4 className="my-4">What data we sell:</h4>
      <p>
        None, as:
      </p>
      <ol>
        <li className="mb-1">
          We are an open-source project that values privacy, and
        </li>
        <li>
          We don't collect any personal data about you in the first place.
        </li>
      </ol>
    </div>
  </div>
);


// ----- Component -------------------------------------------------------------

export default function AboutPage() {
  return (
    <div className="my-3 my-sm-4">
      <AboutSection />
      <hr className="my-4 pb-2" />
      <Links />
      <hr className="my-4 pb-2" />
      <SearchHelp />
      <hr className="my-4 pb-2" />
      <TermsOfService />
      <hr className="my-4 pb-2" />
      <PrivacyPolicy />
    </div>
  );
}
