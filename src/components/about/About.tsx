import React from 'react';
import {styled} from 'linaria/react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';


// ----- Styles ----------------------------------------------------------------

const About = styled.div`
  & ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;


// ----- Component -------------------------------------------------------------

const AboutComponent: React.FunctionComponent = () => {
  return (
    <About className="my-4 p-lg-3">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">About</h2>
          <p>
            Signal Stickers is a community-organized, unofficial directory of sticker packs for Signal,
            the secure messenger. All content on this website is copyrighted by their respective owners.
            This website is not affiliated with Signal or Open Whisper Systems.
          </p>
          <p>
            <a href="https://twitter.com/search?q=%23makeprivacystick&src=typed_query" rel="noreferrer" target="_blank">
              <strong>#makeprivacystick</strong>
            </a>
          </p>
          <br />
          <hr />
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Links</h2>
          <ul>
            <li>
              <a
                href="https://signal.org"
                rel="noreferrer"
                target="_blank"
                title="Learn More About Signal"
              >
                <Octicon name="link-external" /> Learn More About Signal
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/signalstickers"
                rel="noreferrer"
                target="_blank"
                title="Twitter feed"
              >
                <Octicon name="link-external" /> Twitter feed
              </a>
            </li>
            <li>
              <a
                href="https://github.com/signalstickers/signalstickers"
                rel="noreferrer"
                target="_blank"
                title="GitHub Repository"
              >
                <Octicon name="link-external" /> GitHub Repository
              </a>
            </li>
            <li>
              <a
                href="https://github.com/signalstickers/signalstickers/issues/new"
                rel="noreferrer"
                target="_blank"
                title="Report an Issue"
              >
                <Octicon name="link-external" /> Report an Issue
              </a>
            </li>
            <li>
              <a
                href="https://support.signal.org/hc/articles/360031836512-Stickers#h_c2a0a45b-862f-4d12-9ab1-d9a6844062ca"
                rel="noreferrer"
                target="_blank"
                title="Sticker Pack Creation Guide"
              >
                <Octicon name="link-external" /> Sticker Pack Creation Guide
              </a>
            </li>
          </ul>
          <br />
          <hr />
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Privacy policy</h2>
          <p>
            <h4>What do we collect?</h4>
            We count the number of visitors on <code>signalstickers.com</code>,
            in a way that does <b>not</b> log your IP address, so our visitors
            count is anonymous.<br />
            <code>signalstickers.com</code> is hosted on
            <a href="https://pages.github.com/" rel="noopener noreferrer" target="_blank">GitHub Pages</a>,
            and we use third-party scripts, which might collect your IP address.
          </p>
          <h4>What don't we collect?</h4>
          <p>
            All the rest. We don't use cookies, and don't track you as you visit
            <code>signalstickers.com</code>, or any other site.
          </p>
          <h4>What data do you sell?</h4>
          <p>
            <b>None</b>, as 1. we are an open-source project that values
            privacy, and 2. we don't collect any personal data about you in the
            first place.
          </p>
          <br />
          <hr />
          <br />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Terms of service</h2>
          <p>
            <code>signalstickers.com</code> is provided "as is". We try the best
            we can to keep it up and running, but we are volunteers, and we rely
            on third-parties, so we can't guarantee that <code>signalstickers.com</code>
            will be accessible at any time.
          </p>
        </div>
      </div>
    </About>
  );
};


export default AboutComponent;
