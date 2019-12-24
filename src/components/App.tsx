
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import Container from 'components/Container';
import Footer from 'components/Footer';
import Navbar from 'components/Navbar';
import StickerList from 'components/StickerPackList';
import StickerPackDetail from 'components/StickerPackDetail';
import {Provider as StickersContextProvider} from 'contexts/StickersContext';


const App: React.FunctionComponent = () => {
  return (
    <Router>
      <StickersContextProvider>
        <Navbar />
        <Container>
          <Switch>
            <Route exact path="/">
              <StickerList />
            </Route>
            <Route path="/pack/:packId">
              <StickerPackDetail />
            </Route>
          </Switch>
        </Container>
        <Footer />
      </StickersContextProvider>
    </Router>
  );
};


export default App;
