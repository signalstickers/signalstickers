import cx from 'classnames';
import React from 'react';
import { useHistory } from 'react-router-dom';

import StickersContext from 'contexts/StickersContext';


export interface TagProps {
  className?: string;
  label: string;
}


export default function Tag({className, label}: TagProps) {
  // Current search query, will be used if the users clicks on tags
  const {searcher, setSearchQuery} = React.useContext(StickersContext);
  const history = useHistory();

  /**
   * [Event Handler] Search from packs with same tags.
   */
  const onTagClick = React.useCallback((event: React.SyntheticEvent) => {
    event.preventDefault();

    if (searcher) {
      setSearchQuery(searcher.buildQueryString({
        attributeQueries: [{
          tag: label
        }]
      }));

      history.push('/');
    }
  }, [searcher]);

  return (
    <button
      type="button"
      title={`View more packs with tag "${label}"`}
      className={cx(
        'btn btn-outline-primary btn-sm px-2 py-0 my-0 rounded-lg text-nowrap',
        className
      )}
      role="link"
      onClick={onTagClick}
    >
      {label}
    </button>
  );
}
