import { Offcanvas } from 'bootstrap';
import cx from 'classnames';
import React from 'react';
import { BsBoxArrowUpRight, BsXLg, BsThreeDotsVertical } from 'react-icons/bs';
import { FaGithub, FaRss, FaTwitter } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import { SiKofi } from 'react-icons/si';
import { Link, NavLink } from 'react-router-dom';

import signalStickersLogoUrl from 'assets/favicon.png';
import ExternalLink from 'components/general/ExternalLink';
import AppStateContext from 'contexts/AppStateContext';

import classes from './Navbar.css';


/**
 * Whether we are in standalone/PWA mode. This only needs to be checked once
 * because it will never change at runtime.
 */
const IS_STANDALONE = window.matchMedia('(display-mode: standalone)').matches;


/**
 * Element ID used to wire-up the off-canvas menu with its toggler and ARIA
 * attributes.
 */
const OFFCANVAS_NAV_ID = 'offcanvas-nav';


/**
 * Breakpoint above which we show the standard navbar rather than the off-canvas
 * nav menu. We use a variable for this because it is used in several places
 * which _must_ be kept in sync.
 *
 * N.B. In standalone mode, we always use the off-canvas nav menu.
 */
const NAV_EXPAND_BREAKPOINT = 'md';


/**
 * Attributes for internal nav links.
 */
const links = {
  contribute: {
    title: 'Contribute',
    href: '/contribute'
  },
  about: {
    title: 'About',
    href: '/about'
  }
};


/**
 * Attributes for external nav links.
 */
const externalLinks = {
  donate: {
    title: 'Donate',
    href: 'https://ko-fi.com/signalstickers',
    icon: <SiKofi />
  },
  twitter: {
    title: 'Twitter',
    href: 'https://twitter.com/signalstickers',
    icon: <FaTwitter />
  },
  rss: {
    title: 'RSS',
    href: 'https://api.signalstickers.org/feed/rss/',
    icon: <FaRss />
  },
  gitHub: {
    title: 'GitHub',
    href: 'https://github.com/signalstickers/signalstickers',
    icon: <FaGithub />
  }
};


/**
 * Icon used for external nav links in the off-canvas nav menu.
 */
const externalLinkIcon = <BsBoxArrowUpRight className="me-3 fs-5 overflow-visible" />;


/**
 * This component is responsible for the top navbar as well as the off-canvas
 * nav menu used on smaller breakpoints.
 *
 * It is worth noting that we do not use the idiomatic Bootstrap pattern of
 * re-using the same markup for both, which relies on Bootstrap's classes to
 * show/hide/relocate nav links from the navbar to the off-canvas nav menu when
 * appropriate. This is because our styling needs are too divergent between the
 * two, and it is far easier to duplicate the markup and make changes to one nav
 * component without having to worry about how it may affect the other.
 *
 * In short, we are trading verbosity for maintainability and sanity.
 *
 * See: https://getbootstrap.com/docs/5.3/components/navbar/#offcanvas
 */
export default function Nav() {
  const { toggleAppState } = React.useContext(AppStateContext);
  const [darkMode, toggleDarkMode] = toggleAppState('darkMode');
  const offCanvasRef = React.createRef<HTMLDivElement>();
  const offCanvasInstance = React.useRef<Offcanvas>();


  /**
   * Creates an Offcanvas instance linked to our target element, allowing us to
   * use Bootstrap's JavaScript API to control the nav.
   */
  React.useEffect(() => {
    if (!offCanvasRef.current) return;
    offCanvasInstance.current = Offcanvas.getOrCreateInstance(offCanvasRef.current);
    return () => offCanvasInstance.current?.hide();
  }, []);


  /**
   * Toggles the off-canvas nav menu.
   */
  const toggleNavigation = React.useCallback(() => {
    if (!offCanvasInstance.current) {
      console.warn('NO INSTANCE');
      return;
    }
    offCanvasInstance.current.toggle();
  }, [offCanvasInstance.current]);


  /**
   * Renders links for the top navbar for applicable breakpoints / environments.
   */
  const topNavFragment = React.useMemo(() => {
    // These links are never rendered in standalone mode.
    if (IS_STANDALONE) return;

    return (
      <ul
        className={cx(
          classes.navbarNav,
          `navbar-nav ms-auto d-none d-${NAV_EXPAND_BREAKPOINT}-flex`
        )}
      >
        {/* Contribute */}
        <li className="nav-item">
          <NavLink
            to={links.contribute.href}
            title={links.contribute.title}
            className="nav-link py-2"
            activeClassName="active"
          >{links.contribute.title}</NavLink>
        </li>

        {/* About */}
        <li className="nav-item">
          <NavLink
            to={links.about.href}
            title={links.about.title}
            className="nav-link py-2"
            activeClassName="active"
          >{links.about.title}</NavLink>
        </li>

        {/* Donate */}
        <li className="nav-item">
          <ExternalLink
            href={externalLinks.donate.href}
            title={externalLinks.donate.title}
            className="nav-link py-2"
          >
            {externalLinks.donate.icon} {externalLinks.donate.title}
          </ExternalLink>
        </li>

        {/* Twitter */}
        <li className="nav-item">
          <ExternalLink
            href={externalLinks.twitter.href}
            title={externalLinks.twitter.title}
            className="nav-link py-2"
          >
            {externalLinks.twitter.icon}
          </ExternalLink>
        </li>

        {/* RSS */}
        <li className="nav-item">
          <ExternalLink
            href={externalLinks.rss.href}
            title={externalLinks.rss.title}
            className="nav-link py-2"
          >
            {externalLinks.rss.icon}
          </ExternalLink>
        </li>

        {/* GitHub */}
        <li className="nav-item">
          <ExternalLink
            href={externalLinks.gitHub.href}
            title={externalLinks.gitHub.title}
            className="nav-link py-2"
          >
            {externalLinks.gitHub.icon}
          </ExternalLink>
        </li>

        {/* Dark Mode Toggle */}
        <li className="nav-item">
          <button
            type="button"
            className="btn nav-link py-2"
            title="Toggle Dark Mode"
            onClick={toggleDarkMode}
          >
            {darkMode
            ? <FiSun className="me-2" />
            : <FiMoon className="me-2" />
            }
          </button>
        </li>
      </ul>
    );
  }, [
    darkMode,
    toggleDarkMode
  ]);


  /**
   * Renders links for the off-canvas navbar.
   */
  const offCanvasNavFragment = React.useMemo(() => {
    // In standalone mode this element is always rendered and does not require a
    // display class.
    const displayClassName = !IS_STANDALONE && `d-${NAV_EXPAND_BREAKPOINT}-none`;

    return (
      <div
        id={OFFCANVAS_NAV_ID}
        ref={offCanvasRef}
        className={cx(
          'offcanvas offcanvas-end safe-area-padding-top safe-area-padding-right',
          displayClassName
        )}
        tabIndex={-1}
        aria-label="Off-Canvas Navigation"
        style={{ width: 'max-content' }}
      >
        <div className="offcanvas-header px-0 py-2 bg-transparent">
          {/* Close Button */}
          <button
            type="button"
            className="btn btn-link text-light-emphasis ms-auto mt-1 me-2"
            onClick={toggleNavigation}
            aria-label="Close Navigation"
          >
            <BsXLg className="fs-1" />
          </button>
        </div>

        <div className="offcanvas-body ps-4 pe-5 pt-1">
          <ul className="navbar-nav ms-auto gap-2">

            {/* Contribute */}
            <li className="nav-item">
              <NavLink
                to={links.contribute.href}
                title={links.contribute.title}
                className="nav-link py-2 fs-4 text-light-emphasis"
                activeClassName="active"
                onClick={toggleNavigation}
              >{links.contribute.title}</NavLink>
            </li>

            {/* About */}
            <li className="nav-item">
              <NavLink
                to={links.about.href}
                title={links.about.title}
                className="nav-link py-2 fs-4 text-light-emphasis"
                activeClassName="active"
                onClick={toggleNavigation}
              >{links.about.title}</NavLink>
            </li>

            {/* Donate */}
            <li className="nav-item">
              <ExternalLink
                href={externalLinks.donate.href}
                title={externalLinks.donate.title}
                className="nav-link d-flex align-items-center fs-4 text-light-emphasis"
                onClick={toggleNavigation}
              >
                {externalLinkIcon}
                {externalLinks.donate.title}
              </ExternalLink>
            </li>

            {/* Twitter */}
            <li className="nav-item">
              <ExternalLink
                href={externalLinks.twitter.href}
                title={externalLinks.twitter.title}
                className="nav-link d-flex align-items-center fs-4 text-light-emphasis"
                onClick={toggleNavigation}
              >
                {externalLinkIcon}
                {externalLinks.twitter.title}
              </ExternalLink>
            </li>

            {/* RSS */}
            <li className="nav-item">
              <ExternalLink
                href={externalLinks.rss.href}
                title={externalLinks.rss.title}
                className="nav-link d-flex align-items-center fs-4 text-light-emphasis"
                onClick={toggleNavigation}
              >
                {externalLinkIcon}
                {externalLinks.rss.title}
              </ExternalLink>
            </li>

            {/* GitHub */}
            <li className="nav-item">
              <ExternalLink
                href={externalLinks.gitHub.href}
                title={externalLinks.gitHub.title}
                className="nav-link d-flex align-items-center fs-4 text-light-emphasis"
                onClick={toggleNavigation}
              >
                {externalLinkIcon}
                {externalLinks.gitHub.title}
              </ExternalLink>
            </li>

            {/* Dark Mode Toggle */}
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-link nav-link py-2 fs-4 text-light-emphasis"
                title="Toggle Dark Mode"
                onClick={toggleDarkMode}
              >
                {darkMode
                  ? <span><FiSun className="me-2" /> Light Mode</span>
                  : <span><FiMoon className="me-2" /> Dark Mode</span>
                }
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }, [
    darkMode,
    toggleDarkMode,
    toggleNavigation
  ]);


  return (
    <nav
      className={cx(
        'navbar fixed-top bg-primary shadow',
        !IS_STANDALONE && `navbar-expand-${NAV_EXPAND_BREAKPOINT}`
      )}
      // In PWA/standalone mode, the viewport is always the size of the entire
      // screen, including unsafe areas. So, we need to apply some top padding
      // to our fixed navbar to push its content downwards and fill-in the
      // unsafe area with the navbar's background color.
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + var(--bs-navbar-padding-y))' }}
    >
      <div className="container ps-3">
        {/* Brand / Home Link */}
        <Link
          // This will preserve any query params in the URL.
          to={({ search }) => ({ pathname: '/', search })}
          className="navbar-brand d-flex align-items-center fs-4"
        >
          <img
            src={signalStickersLogoUrl}
            alt="Signal Stickers Logo"
            className="me-3"
            style={{ height: '36px' }}
          />
          Signal Stickers
        </Link>

        {/* Toggler */}
        <button
          type="button"
          className="navbar-toggler border-0 shadow-none"
          onClick={toggleNavigation}
          aria-controls={OFFCANVAS_NAV_ID}
          aria-label="Toggle Navigation"
        >
          <BsThreeDotsVertical className="fs-2 text-light" />
        </button>
        {topNavFragment}
        {offCanvasNavFragment}
      </div>
    </nav>
  );
}
