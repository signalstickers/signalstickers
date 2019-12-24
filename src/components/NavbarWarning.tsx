import React, {useState, useEffect} from 'react';
import {styled} from 'linaria/react';
import pWaitFor from 'p-wait-for';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';

import Container from 'components/Container';
import {YELLOW} from 'etc/colors';


// ----- Styles ----------------------------------------------------------------

const NavbarWarningWrapper = styled.div`
  background-color: ${YELLOW};
`;

const NavbarWarning = styled.div`
  color: white;
  font-size: 14px;
  padding: 8px;

  & strong {
    font-weight: 600;
  }
`;


// ----- Component -------------------------------------------------------------

const NavbarWarningComponent: React.FunctionComponent = () => {
  const [modernizrLoaded, setModernizrLoaded] = useState(false);

  useEffect(() => {
    async function waitForModernizrEffect() {
      await pWaitFor(() => Modernizr?.webp !== undefined);
      setModernizrLoaded(true);
    }

    waitForModernizrEffect(); // tslint:disable-line no-floating-promises
  }, []);

  // Either Modernizr hasn't finished initializing yet or the browser supports
  // WEBP.
  if (!modernizrLoaded || Modernizr.webp) {
    return null; // tslint:disable-line no-null-keyword
  }

  return (
    <NavbarWarningWrapper>
      <Container>
        <NavbarWarning>
          <Octicon name="alert" /> <strong>Warning:</strong> You are using a browser that does not support the WebP image format. This will result in serious performance degradation and stability issues.
        </NavbarWarning>
      </Container>
    </NavbarWarningWrapper>
  );
};


export default NavbarWarningComponent;
