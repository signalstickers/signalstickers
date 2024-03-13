import React from 'react';


export default function SuspenseFallback() {
  const [showSpinner, setShowSpinner] = React.useState(false);

  /**
   * Time in milliseconds to wait after the component mounts before showing the
   * loading spinner. Hiding the spinner on faster page transitions can improve
   * perceived performance.
   */
  const SPINNER_DELAY = 2000;

  React.useEffect(() => {
    const timeoutHandle = setTimeout(() => {
      setShowSpinner(true);
    }, SPINNER_DELAY);

    return () => {
      clearTimeout(timeoutHandle);
    };
  }, []);

  return (
    <div className="d-flex align-items-center justify-content-center flex-grow-1">
      {showSpinner && (
        <div
          className="spinner-border"
          role="status"
          style={{
            borderWidth: '2px',
            color: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}
