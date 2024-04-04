import React from 'react';
import { IconContext } from 'react-icons';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import AppLayout from 'components/layout/AppLayout';
import { Provider as AppStateContextProvider } from 'contexts/AppStateContext';
import { Provider as StickersContextProvider } from 'contexts/StickersContext';
import { sendHomeBeacon } from 'lib/utils';


// Note: Each top-level route should be imported az a lazy-loaded component.
const Home = React.lazy(async () => import('components/home/Home'));
const Pack = React.lazy(async () => import('components/pack/StickerPackDetail'));
const Contribute = React.lazy(async () => import('components/contribute/Contribute'));
const ContributionStatus = React.lazy(async () => import('components/contributionstatus/ContributionStatus'));
const About = React.lazy(async () => import('components/about/About'));
const Report = React.lazy(async () => import('components/report/Report'));


export default function App() {
  sendHomeBeacon();

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
        <AppStateContextProvider>
          <StickersContextProvider>
            <BrowserRouter>
              <AppLayout>
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
              </AppLayout>
            </BrowserRouter>
          </StickersContextProvider>
        </AppStateContextProvider>
      </IconContext.Provider>
    </React.StrictMode>
  );
}
