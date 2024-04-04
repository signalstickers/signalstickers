import React from 'react';

import Navbar from 'components/layout/Navbar';
import SuspenseFallback from 'components/layout/SuspenseFallback';


export default function AppLayout({ children }: React.PropsWithChildren) {
  return (<>
    <Navbar />
    <div
      className="d-flex flex-grow-1"
      // Padding to account for the fixed navbar.
      style={{ paddingTop: '60px' }}
    >
      <div className="container-md d-flex flex-column flex-grow-1 px-3">
        <React.Suspense fallback={<SuspenseFallback />}>
          {children}
        </React.Suspense>
      </div>
    </div>
  </>);
}
