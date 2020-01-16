import React from 'react';


const Tag: React.FunctionComponent = props => {
  return (
    <div className="badge badge-primary mr-1">
      {props.children}
    </div>
  );
};


export default Tag;
