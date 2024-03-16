import pThrottle from 'p-throttle';
import React from 'react';
import { Switch, Route } from 'react-router-dom';
// @ts-expect-error
import { useScrollPercentage } from 'react-scroll-percentage';
import useAsyncEffect from 'use-async-effect';

import Navbar from 'components/layout/Navbar';
import SuspenseFallback from 'components/layout/SuspenseFallback';
import AppStateContext from 'contexts/AppStateContext';
import { PRIMARY_DARKER } from 'etc/colors';

import classes from './AppLayout.css';


// Note: Each top-level route should be imported az a lazy-loaded component.
const Home = React.lazy(async () => import('components/home/Home'));
const Pack = React.lazy(async () => import('components/pack/StickerPackDetail'));
const Contribute = React.lazy(async () => import('components/contribute/Contribute'));
const ContributionStatus = React.lazy(async () => import('components/contributionstatus/ContributionStatus'));
const About = React.lazy(async () => import('components/about/About'));
const Report = React.lazy(async () => import('components/report/Report'));


export default function AppLayout() {
  const useAppState = React.useContext(AppStateContext);
  const [darkMode] = useAppState<boolean>('darkMode');
  const [ref, percentage] = useScrollPercentage();


  /**
   * [Effect]
   *
   * Apply classes to <body> to indicate the current theme. We do this here
   * (even though we are a child of <body>) because this is the highest level
   * React component in our tree that renders actual HTML.
   */
  React.useEffect(() => {
    const bodyEl = document.querySelector('body');

    if (!bodyEl) {
      return;
    }

    if (darkMode) {
      bodyEl.classList.add('theme-dark');
      bodyEl.classList.remove('theme-light');
    } else {
      bodyEl.classList.add('theme-light');
      bodyEl.classList.remove('theme-dark');
    }
  }, [darkMode]);


  /**
   * [Effect]
   *
   * Ensures that the background color shown during over-scroll matches adjacent
   * content. Unfortunately the only way this can be reliably done at the moment
   * is by changing the body's background color. To minimize performance impact,
   * we run this function asynchronously and throttle calls to a maximum of 10
   * times per second.
   */
  useAsyncEffect(pThrottle(() => {
    const bodyEl = document.querySelector('body');

    if (!bodyEl) {
      return;
    }

    if (darkMode) {
      bodyEl.style.backgroundColor = percentage < 0.5 ? PRIMARY_DARKER : 'var(--dark)';
    } else {
      bodyEl.style.backgroundColor = percentage < 0.5 ? 'var(--primary)' : 'var(--white)';
    }
  }, 10, 1000), [percentage, darkMode]);


  return (<>
    <Navbar />
    <div className={classes.container} ref={ref}>
      <div className="container d-flex flex-column flex-grow-1">
        <React.Suspense fallback={<SuspenseFallback />}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/pack/:packId/report">
              <Report />
            </Route>
            <Route path="/pack/:packId">
              <Pack />
            </Route>
            <Route path="/contribute">
              <Contribute />
            </Route>
            <Route path="/contribution-status">
              <ContributionStatus />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        </React.Suspense>
      </div>
    </div>
  </>);
}
