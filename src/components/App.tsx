import {hot} from 'react-hot-loader/root';
import React, {Suspense} from 'react';
import {IconContext} from 'react-icons';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import {Provider as StickersContextProvider} from 'contexts/StickersContext';
import Navbar from 'components/layout/Navbar';
import SuspenseFallback from 'components/layout/SuspenseFallback';

// Note: Each top-level route should be imported az a lazy-loaded component.
const About = React.lazy(async () => import('components/about/About'));
const Contribute = React.lazy(async () => import('components/contribute/Contribute'));
const Home = React.lazy(async () => import('components/home/Home'));
const Pack = React.lazy(async () => import('components/pack/StickerPackDetail'));


const App: React.FunctionComponent = () => {
  return (
    <React.StrictMode>
      <IconContext.Provider
        value={{
          className: 'icon',
          style: {
            lineHeight: '1em',
            verticalAlign: '-0.125em',
            minHeight: '1em',
            minWidth: '1em'
          }
        }}
      >
        <Router>
          <StickersContextProvider>
            <Navbar />
            <div className="container d-flex flex-grow-1 flex-column">
              <Suspense fallback={<SuspenseFallback />}>
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <Route path="/pack/:packId">
                    <Pack />
                  </Route>
                  <Route path="/contribute">
                    <Contribute />
                  </Route>
                  <Route path="/about">
                    <About />
                  </Route>
                </Switch>
              </Suspense>
            </div>
          </StickersContextProvider>
        </Router>
      </IconContext.Provider>
    </React.StrictMode>
  );
};


export default hot(App);
