import cx from 'classnames';
import React from 'react';
import { BsBoxArrowUpRight, BsList } from 'react-icons/bs';
import { FaGithub, FaRss, FaTwitter } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import { SiKofi } from 'react-icons/si';
import { Link, NavLink } from 'react-router-dom';

import signalStickersLogoUrl from 'assets/favicon.png';
import ExternalLink from 'components/general/ExternalLink';
import AppStateContext from 'contexts/AppStateContext';

import classes from './Navbar.css';


interface NavLinkDescriptor {
  title: string;
  href: string;
  external?: boolean;
  children?: JSX.Element;
}


const navLinks: Array<NavLinkDescriptor> = [{
  title: 'Contribute',
  href: '/contribute'
}, {
  title: 'About',
  href: '/about'
}, {
  title: 'Help Signalstickers to stay alive!',
  href: 'https://ko-fi.com/signalstickers',
  external: true,
  children: <>
    <SiKofi className="d-none d-md-inline" /> Donate
    <span className="d-md-none">
      &nbsp;on Ko-Fi <BsBoxArrowUpRight />
    </span>
  </>
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
  title: 'RSS',
  href: 'https://api.signalstickers.org/feed/rss/',
  external: true,
  children: <>
    <span className="d-md-none">
      RSS <BsBoxArrowUpRight />
    </span>
    <FaRss className="d-none d-md-inline" />
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


const NAVBAR_TOGGLE_ID = 'navbar-toggle';


export default function NavbarComponent() {
  const useAppState = React.useContext(AppStateContext);
  const [darkMode, setDarkMode] = useAppState<boolean>('darkMode');


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
    // @ts-expect-error
    $(`#${NAVBAR_TOGGLE_ID}`).collapse('hide');
  }, []);


  return (
    <nav className={cx(classes.navbar, 'navbar navbar-expand-md navbar-dark')}>
      <div className="container">
        <Link
          to="/"
          className="navbar-brand"
          onClick={collapseNavigation}
        >
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
    </nav>
  );
}
