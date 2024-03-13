import React from 'react';
import { IconContext } from 'react-icons';
import { BrowserRouter as Router } from 'react-router-dom';

import AppLayout from 'components/layout/AppLayout';
import { Provider as AppStateContextProvider } from 'contexts/AppStateContext';
import { Provider as StickersContextProvider } from 'contexts/StickersContext';
import { sendHomeBeacon } from 'lib/utils';


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
            <Router>
              <AppLayout />
            </Router>
          </StickersContextProvider>
        </AppStateContextProvider>
      </IconContext.Provider>
    </React.StrictMode>
  );
}
