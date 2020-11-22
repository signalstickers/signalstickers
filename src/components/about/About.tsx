import React from 'react';
import {BsBoxArrowUpRight} from 'react-icons/bs';

import ExternalLink from 'components/general/ExternalLink';


// ----- Search Help -----------------------------------------------------------

const Example = ({children}: {children: React.ReactNode}) => (
  <div className="card mb-4">
    <div className="card-body">
      <pre className="mb-0"><code>{children}</code></pre>
    </div>
  </div>
);

const Attr = ({children}: {children: React.ReactNode}) => (
  <code className="text-primary font-weight-bolder">{children}</code>
);

const Term = ({children}: {children: React.ReactNode}) => (
  <code className="text-dark font-weight-bolder">{children}</code>
);

const SearchHelp = () => (
  <div className="row">
    <div className="col-12">
      <h1 id="searching" className="mb-4">Advanced Searching</h1>
      <p className="mb-4">
        Generally, a search query will search across all indexed attributes of a sticker pack. These
        attributes are <Attr>title</Attr>, <Attr>author</Attr>, and <Attr>tags</Attr>. It is also
        possible to perform a more targeted query that only searches on a specific attribute of a
        sticker pack. For instance, to search on just the <Attr>author</Attr> attribute with the
        query <Term>Sindre</Term>:
      </p>
      <Example>author:Sindre</Example>
      <p className="mb-4">
        A search may be further refined by providing additional attribute clauses, each separated by a
        space. For example, to search for all packs whose <Attr>author</Attr> contains the
        term <Term>Sindre</Term> and that have a <Attr>tag</Attr> containing the
        term <Term>awesome</Term>:
      </p>
      <Example>author:Sindre tag:awesome</Example>
      <p className="mb-4">
        If a search term contains spaces, it should be bracketed by double quotes:
      </p>
      <Example>author:"Sindre is a horse" tag:awesome</Example>
      <p className="mb-4">
        It is also possible to mix general search terms and attribute clauses. The following query will
        search for all packs whose <Attr>author</Attr> contains the term <Term>Sindre</Term>, and which
        have a tag containing the term <Term>awesome</Term>, and which contain the
        term <Term>unicorn</Term> in <em>any</em> attribute:
      </p>
      <Example>author:Sindre tag:awesome unicorn</Example>
      <p className="mb-4">
        Finally, you can filter by metadata.
        Supported metadata are <Attr>nsfw</Attr>, <Attr>original</Attr> and <Attr>animated</Attr>. For
        example, to search for all animated pack not-NSFW:
      </p>
      <Example>nsfw:false animated:true</Example>
    </div>
  </div>
);


// ----- Terms of Service ------------------------------------------------------

const TermsOfService = () => (
  <div className="row">
    <div className="col-12">
      <h1 id="terms-of-service" className="mb-4">Terms of Service</h1>
      <p>
        <code>signalstickers.com</code> is provided "as is". We try the best we can to keep it up and
        running, but we are volunteers, and we rely on third-parties, so we can't guarantee
        that <code>signalstickers.com</code> will be accessible at any time.
      </p>
    </div>
  </div>
);


// ----- Privacy Policy --------------------------------------------------------

const PrivacyPolicy = () => (
  <div className="row">
    <div className="col-12">
      <h1 id="privacy-policy" className="mb-4">Privacy Policy</h1>
      <h5 className="my-4">What do we collect?</h5>
      <p>
        We count the number of visitors on <code>signalstickers.com</code> <ExternalLink href="https://gist.github.com/romainricard/3e15e1b7a983722f9e35be9bc4a3e199">
          in a way that does <b>not</b> log your IP address
        </ExternalLink>, so our visitors count is anonymous. <ExternalLink href="https://ping.signalstickers.com/">Statistics are available here.</ExternalLink>
      </p>
      <p>
        <code>signalstickers.com</code> is hosted on <ExternalLink href="https://pages.github.com/">GitHub Pages</ExternalLink>,
        and we use third-party scripts, which might collect your IP address.
      </p>
      <h5 className="my-4">What don't we collect?</h5>
      <p>
        All the rest. We don't use cookies, and don't track you as you visit <code>signalstickers.com</code>,
        or any other site.
      </p>
      <h5 className="my-4">What data do we sell?</h5>
      <p>
        <b>None</b>, as 1. we are an open-source project that values privacy, and 2. we don't collect
        any personal data about you in the first place.
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
    href: 'https://support.signal.org/hc/articles/360031836512-Stickers#h_c2a0a45b-862f-4d12-9ab1-d9a6844062ca'
  }, {
    name: 'Report an Issue',
    href: 'https://github.com/signalstickers/signalstickers/issues/new'
  }];

  return (<>
    <h1 className="mb-4">Links</h1>
    <ul className="list-unstyled">
      {externalLinks.map(({name, href}) => (
        <li key={href}>
          <ExternalLink href={href} title={name}>
            <BsBoxArrowUpRight className="mr-1" />
            {name}
          </ExternalLink>
        </li>
      ))}
    </ul>
  </>);
};


// ----- Component -------------------------------------------------------------

const AboutComponent: React.FunctionComponent = () => {
  return (
    <div className="my-4 p-lg-3">
      <div className="row">
        <div className="col-12">
          <h1 id="about" className="mb-4">About</h1>
          <p>
            Signal Stickers is a community-organized, unofficial directory of sticker packs for Signal,
            the secure messenger. All content on this website is copyrighted by their respective owners.
            This website is not affiliated with Signal or Open Whisper Systems.
          </p>
          <p>
            <ExternalLink href="https://twitter.com/search?q=%23makeprivacystick&src=typed_query">
              <strong>#makeprivacystick</strong>
            </ExternalLink>
          </p>
        </div>
      </div>
      <hr className="my-5" />
      <Links />
      <hr className="my-5" />
      <SearchHelp />
      <hr className="my-5" />
      <TermsOfService />
      <hr className="my-5" />
      <PrivacyPolicy />
    </div>
  );
};


export default AboutComponent;
