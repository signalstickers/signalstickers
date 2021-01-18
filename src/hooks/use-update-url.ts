import queryString, { ParsedUrl } from 'query-string';
import * as R from 'ramda';
import { useHistory } from 'react-router-dom';


/**
 * Provided an object representing a parsed URL, updates the URL with the
 * provided values. Will not trigger a page reload.
 *
 * @example
 *
 * const updateUrl = useUpdateUrl();
 *
 * // Add/update the 'foo' query parameter in the URL:
 * updateUrl({query: {foo: 'bar'}});
 */
export default function useUpdateUrl() {
  const history = useHistory();

  return (newValues: Partial<ParsedUrl>) => {
    const currentUrl = queryString.parseUrl(history.location.pathname);
    const newUrl = queryString.stringifyUrl(R.mergeDeepRight(currentUrl, newValues) as ParsedUrl, {
      // This ensures that the search query param is removed from the URL when
      // the search query is cleared.
      skipEmptyString: true
    });
    history.replace(newUrl);
  };
}
