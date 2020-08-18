import queryString from 'query-string';
import {useLocation} from 'react-router-dom';


/**
 * Custom hook for introspecting URL query parameters.
 *
 * Example usage:
 *
 * const query = useQuery();
 * query.get('foo');
 */
export default function useQuery() {
  return queryString.parse(useLocation().search);
}
