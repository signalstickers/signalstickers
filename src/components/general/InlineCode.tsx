import cx from 'classnames';
import React from 'react';


export default function InlineCode({ children, className }: React.HTMLProps<HTMLDivElement>) {
  // N.B. The spaces on either side of the <code> element help address missing
  // spaces that occur when components are used just after a line break in copy.
  return (
    <code
      className={cx(
        'd-inline fw-medium',
        !className?.includes('text-') && 'text-light-emphasis',
        className
      )}
      style={{ fontSize: '0.95em' }}
    >{children}</code>
  );
}
