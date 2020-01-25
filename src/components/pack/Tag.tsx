import React from 'react';
import {styled} from 'linaria/react';

import {SIGNAL_BLUE} from 'etc/colors';


const Tag = styled.span`
  background-color: ${SIGNAL_BLUE};
  border-radius: 4px;
  color: white;
  display: inline-block;
  font-size: 14px;
  font-weight: 400;
  margin: 2px;
  padding: 2px 8px;
  text-transform: capitalize;
`;


const TagComponent: React.FunctionComponent = props => {
  return (
    <Tag>
      {props.children}
    </Tag>
  );
};


export default TagComponent;
