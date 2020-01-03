import React from 'react';
import {Link} from 'react-router-dom';
import {styled} from 'linaria/react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import SignalLogoUrl from 'assets/signal-logo.png';
import {SIGNAL_BLUE} from 'etc/colors';


// ----- Styles ----------------------------------------------------------------

const StyledNavBar = styled.nav`
  background-color: ${SIGNAL_BLUE};
  color: white;
  padding: 8px 0;

  & .brand {
    font-size: 28px;

    &:hover {
      color: white;
      text-decoration: none;
    }

    & img {
      bottom: 2px;
      height: 32px;
      position: relative;
      width: 32px;
    }
  }
`;


// ----- Component -------------------------------------------------------------

const NavbarComponent: React.FunctionComponent = () => {
  return (
    <>
      <StyledNavBar>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 text-center text-md-left mb-2 mb-sm-1">
              <Link className="brand" to="/"><img src={SignalLogoUrl} alt="Signal Logo" /> Signal Stickers</Link>
            </div>
            <div className="col-12 col-md-6 text-center text-md-right mt-2 mb-2 mb-md-0">
              <a href="https://github.com/romainricard/signalstickers" title="Contribute">
                <button className="btn btn-light btn-sm mr-3"><Octicon name="mark-github" />&nbsp;&nbsp;Contribute</button>
              </a>
              <a href="https://signal.org" title="Get Signal">
                <button className="btn btn-primary btn-sm">Get Signal</button>
              </a>
            </div>
          </div>
        </div>
      </StyledNavBar>
    </>
  );
};


export default NavbarComponent;
