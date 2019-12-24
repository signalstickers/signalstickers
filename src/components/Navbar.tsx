import React from 'react';
import {Link} from 'react-router-dom';
import {styled} from 'linaria/react';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import SignalLogoUrl from 'assets/signal-logo.png';
import Button from 'components/Button';
import Container from 'components/Container';
import FlexSpacer from 'components/FlexSpacer';
import NavbarWarning from 'components/NavbarWarning';
import {SIGNAL_BLUE} from 'etc/colors';


// ----- Styles ----------------------------------------------------------------

const NavbarWrapper = styled.nav`
  align-items: center;
  background-color: ${SIGNAL_BLUE};
  color: white;
  display: flex;
  flex-direction: row;
  min-height: 70px;

  & .brand {
    color: white;
    margin-left: 4px;
    font-weight: 400;
  }

  & .nav-items {
    align-items: center;
    display: flex;

    & a:not(:last-child) {
      margin-right: 12px;
    }
  }
`;

const NavbarInner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-size: 24px;
  line-height: 24px;
  height: 100%;
`;


// ----- Component -------------------------------------------------------------

const NavbarComponent: React.FunctionComponent = () => {
  return (
    <>
      <NavbarWrapper>
        <Container>
          <NavbarInner>
            <img src={SignalLogoUrl} alt="Signal Logo" />
            <Link to="/" className="brand">
              Signal Stickers
            </Link>
            <FlexSpacer />
            <div className="nav-items">
              <a href="https://github.com/romainricard/signalstickers" title="Contribute">
                <Button variant="secondary"><Octicon name="mark-github" />&nbsp;&nbsp;Contribute</Button>
              </a>
              <a href="https://signal.org" title="Get Signal">
                <Button>Get Signal</Button>
              </a>
            </div>
          </NavbarInner>
        </Container>
      </NavbarWrapper>
      <NavbarWarning />
    </>
  );
};


export default NavbarComponent;
