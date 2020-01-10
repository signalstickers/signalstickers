import React from 'react';


const Tag: React.FunctionComponent = props => {
  return (
    <div className="badge badge-primary">
      {props.children}
    </div>
  );
};


export default Tag;
