import React from 'react';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { SiKofi } from 'react-icons/si';

import ExternalLink from 'components/general/ExternalLink';
import { IoSparklesSharp } from 'react-icons/io5';


// ----- Search Help -----------------------------------------------------------

const Example = ({ children }: { children: React.ReactNode }) => (
  <div className="card mb-4">
    <div className="card-body">
      <pre className="mb-0"><code>{children}</code></pre>
    </div>
  </div>
);

const Attr = ({ children }: { children: React.ReactNode }) => (
  <code className="text-primary font-weight-bolder">{children}</code>
);

const Term = ({ children }: { children: React.ReactNode }) => (
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
        <code>signalstickers.org</code> is provided "as is". We try the best we can to keep it up and
        running, but we are volunteers, and we rely on third-parties, so we can't guarantee
        that <code>signalstickers.org</code> will be accessible at any time.
      </p>
      <p>
        The inclusion, in whole or in part, of the <code>signalstickers.org</code> website in any other
        application, website, or software is strictly forbidden.
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
        To provide statistics, we count the number of visitors on <code>signalstickers.org</code> <ExternalLink href="https://gist.github.com/romainricard/7ac34b6ea34a58f6c98087ae9aadfbc0">
          in a way that does <b>not</b> log your IP address</ExternalLink>, so our statistics are anonymous.
      </p>
      <p>
        <code>signalstickers.org</code> interface is hosted on <ExternalLink href="https://pages.github.com/">GitHub Pages</ExternalLink>,
        and we use third-party scripts, which might collect your IP address. Our API server is cached by Cloudflare, which might collect your IP address.
      </p>
      <h5 className="my-4">What don't we collect?</h5>
      <p>
        All the rest. We don't use cookies, we don't use Google Analytics, and we don't track you as you visit any other site.
      </p>
      <h5 className="my-4">What data do we sell?</h5>
      <p>
        <b>None</b>, as 1. we are an open-source project that values privacy, and 2. we don't collect
        any personal data about you in the first place.
      </p>
    </div>
  </div>
);

// ----- Editor's choices  --------------------------------------------------------

const EditorsChoices = () => (
  <div className="row">
    <div className="col-12">
      <h1 id="privacy-policy" className="mb-4">Editor's Choice <IoSparklesSharp/> </h1>
      <p>
        The Editor's choice label highlights the packs we love, hand-picked by our moderation team.
        These are chosen at our discretion to help you discover cool packs without having to scroll through everything.
      </p>
    </div>
  </div>
);

// ----- AI policy  --------------------------------------------------------

const AIPolicy = () => (
  <div className="row">
    <div className="col-12">
      <h1 id="privacy-policy" className="mb-4">AI policy</h1>
      <p>
       We use AI to help us with the following tasks:
       <ul>
        <li>
          <strong>Moderation:</strong> we use AI to help us review submitted packs. <strong>Moderation is still done manually by humans</strong>;
          we only use AI to <strong>help us understand context </strong>we might not be aware of (e.g. cultural references from a
          country we don't live in), and to ensure we don't miss sensitive content. <i>Model currently used: Gemma 4</i>
        </li>
        <li>
          <strong>Tags improvement:</strong> we use AI to add tags to packs that are missing them (or have too few), so you can find them easily.
          This process is supervised by a moderator, so inadequate tags are removed. Do not hesitate to report a pack if you find that
          tags do not match the content. <i>Model currently used: Gemma 4</i>
        </li>
        <li>
          <strong>Development:</strong> we use AI to help us develop signalstickers.org. <i>Multiple models used.</i>
        </li>
       </ul>
      </p>
      <p>
       <u>All</u> the models we use are self-hosted, on infrastructure we have <u>full control over</u>, using free software.
       No data is being sent to AI giants (because we don't use them).
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
      {externalLinks.map(({ name, href }) => (
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

export default function AboutComponent() {
  return (
    <div className="my-4 p-lg-3">
      <div className="row">
        <div className="col-12">
          <h1 id="about" className="mb-4">About</h1>
          <p>
            Signal Stickers is a community-organized, unofficial directory of sticker packs for Signal,
            the secure messenger. All content on this website is copyrighted by their respective owners.
            This website is <b>not affiliated with Signal</b> or Open Whisper Systems.
          </p>
          <p>
            Signal Stickers is free and open-source. You can support us and help pay hosting fees by
            {' '}
            <ExternalLink href="https://ko-fi.com/signalstickers" title="Donate on Ko-Fi!">
              <SiKofi className="d-none d-md-inline" /> donating on Ko-Fi.
            </ExternalLink></p>
        </div>
      </div>
      <hr className="my-5" />
      <Links />
      <hr className="my-5" />
      <EditorsChoices/>
      <hr className="my-5" />
      <SearchHelp />
      <hr className="my-5" />
      <TermsOfService />
      <hr className="my-5" />
      <PrivacyPolicy />
      <hr className="my-5" />
      <AIPolicy />
    </div>
  );
}
