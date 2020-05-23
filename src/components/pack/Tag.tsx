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

  &:hover {
    color: white;
  }
`;


export interface TagProps {
  label: string;
}


const TagComponent: React.FunctionComponent<TagProps> = ({label}) => {
  // Current search query, will be used if the users clicks on tags
  const {setSearchQuery} = useContext(StickersContext);
  const history = useHistory();

  /**
   * [Event Handler] Search from packs with same tags.
   */
  const onTagClick = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (event.currentTarget.textContent) {
      setSearchQuery(event.currentTarget.textContent);
      history.push('/');
    }
  };

  return (
    <Tag
      title={`View more packs with tag "${label}"`}
      className="btn"
      onClick={onTagClick}
    >
      {label}
    </Tag>
  );
};


export default TagComponent;
