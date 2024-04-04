import React from 'react';


/**
 * Sets the document title to the provided value throughout the lifecycle of a
 * component and reverts it to its previous value when it un-mounts.
 */
export default function useDocumentTitle(title: string | undefined) {
  const defaultTitle = React.useRef(document.title);

  React.useEffect(() => {
    if (!title) return;

    document.title = title;

    return () => {
      document.title = defaultTitle.current;
    };
  }, [title]);
}
