import {styled} from 'linaria/react';
import {darken} from 'polished';
import React from 'react';
import {BsBoxArrowUpRight, BsList} from 'react-icons/bs';
import {FaGithub, FaTwitter} from 'react-icons/fa';
import {FiSun, FiMoon} from 'react-icons/fi';
import {Link, NavLink} from 'react-router-dom';

import signalStickersLogoUrl from 'assets/favicon.png';
import ExternalLink from 'components/general/ExternalLink';
import AppStateContext from 'contexts/AppStateContext';
import {PRIMARY_DARKER} from 'etc/colors';
import {NAVBAR_HEIGHT} from 'etc/constants';
import {bp} from 'lib/utils';


// ----- Types -----------------------------------------------------------------

interface NavLinkDescriptor {
  title: string;
  href: string;
  external?: boolean;
  children?: JSX.Element;
}


// ----- Styles ----------------------------------------------------------------

const StyledNav = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding-bottom: 6px;
  padding-top: 6px;

  /*
   * N.B. Navbar height will need to increase when the navigation menu is
   * expanded on mobile.
   */
  min-height: ${NAVBAR_HEIGHT}px;

  @media ${bp('md')} {
    max-height: ${NAVBAR_HEIGHT}px;
  }

  /**
   * We need to fight with Bootstrap's specificity a little here, hence the
   * verbose selector.
   */
  &.navbar-dark .navbar-nav .nav-link {
    color: ${darken(0.07, 'white')};
    transition: color 0.15s ease;
    letter-spacing: 0.05em;

    &.active {
      color: white;
    }

    & svg {
      fill: ${darken(0.1, 'white')};
      transition: fill 0.15s ease;
    }

    &:hover {
      color: white;

      & svg {
        fill: white;
      }
    }
  }

  /* Creates a border between the navbar and menu items when open (on mobile). */
  & .container::before {
    content: '';
    display: block;
    position: absolute;
    width: 200vw;
    left: -100vw;
    top: ${NAVBAR_HEIGHT + 1}px;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.33);
  }

  & .navbar-brand {
    font-size: 24px;
    color: white;
    letter-spacing: 0.02em;
    padding: 7px 0;

    &:hover {
      color: white;
      text-decoration: none;
    }

    & img {
      bottom: 2px;
      height: 1.5em;
      margin-right: 8px;
      position: relative;
      width: auto;
    }
  }

  & .navbar-toggler {
    border: none;
    font-size: 26px;
    padding-right: 12px;

    &:focus {
      outline: none;
    }
  }

  & .navbar-nav {
    @media ${bp('md', 'max')} {
      padding-top: 10px;
      padding-bottom: 4px;
    }
  }

  & .menu-icon {
    fill: ${darken(0.1, 'white')};
    transform: scale(1.2) translateY(1px);
  }

  .theme-light & {
    background-color: var(--primary);
  }

  .theme-dark & {
    background-color: ${PRIMARY_DARKER};

    & .navbar-brand img {
      filter: brightness(0.75);
    }
  }
`;


// ----- Component -------------------------------------------------------------

const NavbarComponent: React.FunctionComponent = () => {
  const useAppState = React.useContext(AppStateContext);
  const [darkMode, setDarkMode] = useAppState<boolean>('darkMode');

  const NAVBAR_TOGGLE_ID = 'navbar-toggle';

  const navLinks: Array<NavLinkDescriptor> = [{
    title: 'Contribute',
    href: '/contribute'
  }, {
    title: 'About',
    href: '/about'
  }, {
    title: 'Twitter',
    href: 'https://twitter.com/signalstickers',
    external: true,
    children: <>
      <span className="d-md-none">
        Twitter <BsBoxArrowUpRight />
      </span>
      <FaTwitter className="d-none d-md-inline" />
    </>
  }, {
    title: 'GitHub Repository',
    href: 'https://github.com/signalstickers/signalstickers',
    external: true,
    children: <>
      <span className="d-md-none">
        GitHub <BsBoxArrowUpRight />
      </span>
      <FaGithub className="d-none d-md-inline" />
    </>
  }];


  /**
   * Toggles dark mode.
   */
  const toggleDarkMode = React.useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode]);


  /**
   * Closes the navigation menu (on small devices) upon navigation.
   */
  const collapseNavigation = React.useCallback(() => {
    $(`#${NAVBAR_TOGGLE_ID}`).collapse('hide');
  }, []);


  return (
    <StyledNav className="navbar navbar-expand-md navbar-dark">
      <div className="container">
        <Link to="/" className="navbar-brand" onClick={collapseNavigation}>
          <img src={signalStickersLogoUrl} alt="Signal Stickers Logo" /> Signal Stickers
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
          <BsList className="menu-icon" />
        </button>
        <div id={NAVBAR_TOGGLE_ID} className="collapse navbar-collapse">
          <ul className="navbar-nav ml-auto mt-2 mt-md-0 pb-xs-0">
            {navLinks.map(navLink => (
              <li className="nav-item" key={navLink.href}>
                {navLink.external ?
                  <ExternalLink
                    href={navLink.href}
                    title={navLink.title}
                    className="nav-link py-3 py-md-2"
                  >
                    {navLink.children ?? navLink.title}
                  </ExternalLink> :
                  <NavLink
                    to={navLink.href}
                    title={navLink.title}
                    className="nav-link py-3 py-md-2"
                    activeClassName="active"
                    onClick={collapseNavigation}
                  >
                    {navLink.children ?? navLink.title}
                  </NavLink>
                }
              </li>
            ))}
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-link nav-link py-3 py-md-2"
                title="Dark Mode"
                onClick={toggleDarkMode}
              >
                {darkMode ?
                  <>
                    <span className="d-inline-block d-md-none mr-1">
                      Light mode
                    </span>
                    <FiSun />
                  </>
                  :
                  <>
                    <span className="d-inline-block d-md-none mr-1">
                      Dark mode
                    </span>
                    <FiMoon />
                  </>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </StyledNav>
  );
};


export default NavbarComponent;
