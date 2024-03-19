import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Navbar from 'components/layout/Navbar';
import SuspenseFallback from 'components/layout/SuspenseFallback';
import AppStateContext from 'contexts/AppStateContext';


// Note: Each top-level route should be imported az a lazy-loaded component.
const Home = React.lazy(async () => import('components/home/Home'));
const Pack = React.lazy(async () => import('components/pack/StickerPackDetail'));
const Contribute = React.lazy(async () => import('components/contribute/Contribute'));
const ContributionStatus = React.lazy(async () => import('components/contributionstatus/ContributionStatus'));
const About = React.lazy(async () => import('components/about/About'));
const Report = React.lazy(async () => import('components/report/Report'));


export default function AppLayout() {
  const { useAppState } = React.useContext(AppStateContext);
  const [darkMode] = useAppState<boolean>('darkMode');
  const contentRef = React.createRef<HTMLDivElement>();


  /**
   * Adds or removes a data attribute to the <html> element to enable or disable
   * dark mode.
   */
  React.useEffect(() => {
    const htmlEl = document.querySelector('html');
    if (!htmlEl) return;
    htmlEl.dataset.bsTheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);


  return (<>
    <Navbar />
    <div
      className="d-flex flex-grow-1"
      // Padding to account for the fixed navbar.
      style={{ paddingTop: '60px' }}
      ref={contentRef}
    >
      <div className="container d-flex flex-column flex-grow-1 px-3">
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
