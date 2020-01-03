import {styled} from 'linaria/react';
import {darken} from 'polished';

import {SIGNAL_BLUE} from 'etc/colors';


const Tag = styled.div`
  background-color: ${darken(0, SIGNAL_BLUE)};
  border-radius: 4px;
  border: 1px solid ${darken(0.1, 'white')};
  color: white;
  display: inline-block;
  font-size: 12px;
  font-weight: 400;
  line-height: 1em;
  padding: 5px 7px;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.4);
  margin-right: 3px;
  margin-left: 3px;
  position: relative;
  top: 0px;
`;


export default Tag;
