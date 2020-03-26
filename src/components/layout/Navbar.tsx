import React from 'react';
import {Link} from 'react-router-dom';
import {styled} from 'linaria/react';
import {darken} from 'polished';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import SignalLogoUrl from 'assets/signal-logo.png';
import {SIGNAL_BLUE} from 'etc/colors';
import {bp} from 'lib/utils';


// ----- Styles ----------------------------------------------------------------

const StyledNav = styled.nav`
  background-color: ${SIGNAL_BLUE};

  /**
   * We need to fight with Bootstrap's specificity a little here, hence the
   * verbose selector.
   */
  &.navbar-dark .navbar-nav .nav-link {
    color: ${darken(0.07, 'white')};
    transition: color 0.15s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:hover {
      color: white;
    }
  }

  & .navbar-brand {
    font-size: 28px;
    font-weight: 400;
    color: white;
    padding: 4px 0;

    &:hover {
      color: white;
      text-decoration: none;
    }

    & img {
      bottom: 2px;
      height: 42px;
      position: relative;
      width: 42px;
    }
  }

  & .navbar-toggler {
    border: none;
    padding: 4px 0px 1px 16px;

    & .octicon {
      color: ${darken(0.1, 'white')};
      font-size: 36px;
      transition: color 0.15s ease;

      &:hover {
        color: white;
      }
    }
  }

  & .navbar-nav {
    @media ${bp('lg', 'max')} {
      border-top: 1px solid rgba(255, 255, 255, 0.33);
      padding: 10px 0px 4px 0px;
    }
  }
`;


// ----- Component -------------------------------------------------------------

const NavbarComponent: React.FunctionComponent = () => {
  const NAVBAR_TOGGLE_ID = 'navbar-toggle';

  return (
    <StyledNav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src={SignalLogoUrl} alt="Signal Logo" /> Signal Stickers
        </Link>
        <button
          type="button"
          className="navbar-toggler"
          data-toggle="collapse"
          data-target={`#${NAVBAR_TOGGLE_ID}`}
          aria-controls={NAVBAR_TOGGLE_ID}
          aria-expanded="false"
          aria-label="Toggle Navigation"
        >
          <Octicon name="grabber" />
        </button>
        <div id={NAVBAR_TOGGLE_ID} className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <Link to="/contribute" className="nav-link" title="Contribute">
                Contribute
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link" title="About">
                About
              </Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="https://twitter.com/signalstickers" rel="noreferrer" target="_blank" title="Twitter feed">
                Twitter feed <Octicon name="link-external" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </StyledNav>
  );
};


export default NavbarComponent;
