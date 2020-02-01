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
              <a href="https://signal.org" rel="noreferrer" target="_blank" title="Learn More About Signal">
                <Octicon name="link-external" /> Learn More About Signal
              </a>
            </li>
            <li>
              <a href="https://github.com/signalstickers/signalstickers" rel="noreferrer" target="_blank" title="GitHub Repository">
                <Octicon name="link-external" /> GitHub Repository
              </a>
            </li>
            <li>
              <a href="https://github.com/signalstickers/signalstickers/issues/new" rel="noreferrer" target="_blank" title="Report an Issue">
                <Octicon name="link-external" /> Report an Issue
              </a>
            </li>
            <li>
              <a href="https://support.signal.org/hc/en-us/articles/360031836512-Stickers#h_c2a0a45b-862f-4d12-9ab1-d9a6844062ca" rel="noreferrer" target="_blank" title="Sticker Pack Creation Guide">
                <Octicon name="link-external" /> Sticker Pack Creation Guide
              </a>
            </li>
          </ul>
        </div>
      </div>
    </About>
  );
};


export default AboutComponent;
