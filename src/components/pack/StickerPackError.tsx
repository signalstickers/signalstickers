import React from 'react';


export default function StickerPackError({ children }: React.PropsWithChildren) {
  return (
    <div className="p-4 my-4">
      <div className="row mb-4">
        <div className="col-10 offset-1 alert alert-danger">
          <h3 className="alert-heading mt-1 mb-3">Error</h3>
          {children}
        </div>
      </div>
    </div>
  );
}
