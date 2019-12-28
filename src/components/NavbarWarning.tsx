import React, {useState, useEffect} from 'react';
import pWaitFor from 'p-wait-for';
// @ts-ignore (No type definitions exist for this package.)
import Octicon from 'react-octicon';


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
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Octicon name="alert" /> <strong>Warning!</strong> You are using a browser that does not support the WebP image format. This will result in serious performance degradation and stability issues.
          </div>
        </div>
      </div>
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
};


export default NavbarWarningComponent;
