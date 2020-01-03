import React from 'react';


const StickerPackError: React.FunctionComponent = props => {
  return (
    <div className="p-4 my-4">
      <div className="row mb-4">
        <div className="col-10 offset-1 alert alert-danger">
          <h3 className="alert-heading mt-1 mb-3">Error</h3>
          {props.children}
        </div>
      </div>
    </div>
  );
};


export default StickerPackError;
