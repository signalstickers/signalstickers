import React from 'react';
import {css, cx} from 'linaria';
import {darken, lighten} from 'polished';

import {SIGNAL_BLUE, GRAY} from 'etc/colors';


// ----- Props -----------------------------------------------------------------

export interface Props {
  // tslint:disable-next-line react-unused-props-and-state
  icon?: string;
  // tslint:disable-next-line react-unused-props-and-state
  variant?: 'primary' | 'secondary';
}


// ----- Styles ----------------------------------------------------------------

const buttonCommon = css`
  align-items: center;
  border-radius: 4px;
  border: none;
  display: inline-flex;
  flex-direction: row;
  font-size: 14px;
  padding: 8px 10px;
  line-height: 1.2em;
  transition: background-color 0.1s ease-in-out, border-color 0.1s ease-in-out;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const buttonPrimary = css`
  background-color: ${darken(0.1, SIGNAL_BLUE)};
  border: 1px solid ${darken(0.1, SIGNAL_BLUE)};
  color: white;

  &:hover {
    background-color: ${darken(0.15, SIGNAL_BLUE)};
    border-color: ${darken(0.08, SIGNAL_BLUE)};
  }
`;

const buttonSecondary = css`
  background-color: ${GRAY};
  border: 1px solid ${darken(0.1, GRAY)};
  color: black;

  &:hover {
    background-color: ${lighten(0.01, GRAY)};
    border-color: ${darken(0.3, GRAY)};
  }
`;

const buttonIcon = css`
  height: 1em;
  margin-right: 0.4em;
  width: 1em;
`;


// ----- Component -------------------------------------------------------------

// N.B. The typings for React.forwardRef should take care of this for us, but
// they do not. If we fail to add these props to our component's typings, we
// won't be able to use props like onClick.
export type DefaultProps = React.HTMLProps<HTMLButtonElement>;

const ButtonComponent = React.forwardRef<HTMLButtonElement, Props & DefaultProps>((props, ref) => {
  const variant = props.variant || 'primary';

  return (
    // @ts-ignore
    <button ref={ref} className={cx(buttonCommon, variant === 'primary' ? buttonPrimary : buttonSecondary)} {...props}>
      {props.icon && <img src={props.icon} className={buttonIcon} alt="icon" />}{props.children}
    </button>
  );
});


export default ButtonComponent;
