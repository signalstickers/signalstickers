import React, {useEffect, useState} from 'react';
import {styled} from 'linaria/react';


const Spinner = styled.div`
  border-width: 2px;
  color: rgba(0, 0, 0, 0.5);
`;


const SuspenseFallbackComponent: React.FunctionComponent = () => {
  const [showSpinner, setShowSpinner] = useState(false);

  /**
   * Time in milliseconds to wait after the component mounts before showing the
   * loading spinner. Hiding the spinner on faster page transitions can improve
   * perceived performance.
   */
  const SPINNER_DELAY = 2000;

  useEffect(() => {
    const timeoutHandle = setTimeout(() => {
      setShowSpinner(true);
    }, SPINNER_DELAY);

    return () => {
      clearTimeout(timeoutHandle);
    };
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center flex-grow-1">
      {showSpinner && <Spinner className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>}
    </div>
  );
};


export default SuspenseFallbackComponent;
