import React, {useContext} from 'react';
import {styled} from 'linaria/react';
import {useHistory} from 'react-router-dom';

import {SIGNAL_BLUE} from 'etc/colors';

import StickersContext from 'contexts/StickersContext';


const Tag = styled.button`
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
  // Current search query, will be used if the users clicks on tags
  const {setSearchQuery} = useContext(StickersContext);
  const history = useHistory();


  /**
   * [Event Handler] Search from packs with same tags
   */
  function onTagClick(event: React.SyntheticEvent) {
    event.preventDefault();
    setSearchQuery(event.currentTarget.textContent);
    history.push('/');
  }

  return (
    <Tag className="btn" onClick={onTagClick} title={`View more packs with tag "${props.children}"`}>
      {props.children}
    </Tag>
  );
};


export default TagComponent;
