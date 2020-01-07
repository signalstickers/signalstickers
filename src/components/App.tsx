import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Navbar from 'components/layout/Navbar';
import Home from 'components/home/Home';
import StickerPackDetail from 'components/pack/StickerPackDetail';
import Footer from 'components/layout/Footer';
import {Provider as StickersContextProvider} from 'contexts/StickersContext';
import Contribute from 'components/contribute/Contribute';


const App: React.FunctionComponent = () => {
  return (
    <Router basename="/signalstickers/">
      <StickersContextProvider>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/pack/:packId">
              <StickerPackDetail />
            </Route>
            <Route path="/contribute">
              <Contribute />
            </Route>
          </Switch>
        </div>
        <Footer />
      </StickersContextProvider>
    </Router>
  );
};


export default App;
