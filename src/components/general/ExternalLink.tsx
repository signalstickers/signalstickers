import React from 'react';
import * as R from 'ramda';


export type ExternalLinkProps = Omit<React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, 'target' | 'rel'>;


/**
 * Renders an anchor element with appropriate `target` and `rel` attributes
 * pre-applied for external links.
 */
const ExternalLink = React.memo(React.forwardRef((props: ExternalLinkProps, ref?: React.Ref<HTMLAnchorElement>) => (
  <a
    target="_blank"
    rel="noreferrer noopener"
    ref={ref}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...R.omit(['children', 'ref'], props)}
  >
    {props.children}
  </a>
)));

ExternalLink.displayName = 'ExternalLink';


export default ExternalLink;
