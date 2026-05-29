import { keyframes, style } from '@vanilla-extract/css';

import { DANGER_SATURATED, SPARKLE_GOLD } from 'etc/colors';


const sparkleFlash = keyframes({
  '0%, 100%': {
    opacity: 0,
    transform: 'scale(0) rotate(0deg)'
  },
  '5%': {
    transform: 'scale(1) rotate(45deg)'
  },
  '15%': {
    opacity: 1,
    transform: 'scale(1.1) rotate(90deg)'
  },
  '25%': {
    opacity: 0.7,
    transform: 'scale(0.9) rotate(135deg)'
  },
  '40%': {
    opacity: 0,
    transform: 'scale(0) rotate(180deg)'
  }
});


const classes: Record<string, string> = {
  searchInputWrapper: style({
    position: 'relative'
  }),
  searchInput: style({
    paddingLeft: '42px',
    ':focus': {
      boxShadow: 'none',
      outline: 'none'
    },
    ':active': {
      boxShadow: 'none',
      outline: 'none'
    }
  }),
  searchInputField: style({
    overflow: 'hidden'
  }),
  searchInputLabel: style({
    cursor: 'pointer'
  }),
  searchPrepend: style({
    alignItems: 'center',
    display: 'flex',
    fontSize: '18px',
    height: '100%',
    left: 0,
    paddingLeft: '14px',
    position: 'absolute',
    top: 0,
    transition: 'color 0.2s ease-in-out',
    zIndex: 3
  }),
  searchHelp: style({
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    opacity: 0,
    padding: '3px 4px 0px 4px',
    pointerEvents: 'none',
    position: 'absolute',
    right: '50px',
    top: '-2px',
    transition: 'opacity 0.2s ease-in-out',
    transform: 'translateY(2px)',
    zIndex: 3
  }),
  searchHelpLink: style({
    opacity: 0.3,
    transition: 'opacity 0.15s ease-in-out',
    ':hover': {
      opacity: 0.5
    }
  }),
  searchHelpIcon: style({
    fontSize: '18px'
  }),
  searchClear: style({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    right: 0,
    top: 0,
    paddingRight: '4px',
    zIndex: 3
  }),
  searchClearButton: style({
    fontSize: '20px',
    ':focus': {
      boxShadow: 'none',
      outline: 'none'
    },
    ':active': {
      boxShadow: 'none',
      outline: 'none'
    }
  }),
  searchClearIcon: style({
    opacity: 0.8,
    color: DANGER_SATURATED,
    transition: 'opacity 0.2s ease-in-out, transform 0.1s ease',
    transform: 'scale(1.5)'
  }),
  miniTag: style({
    backgroundColor: 'transparent',
    border: '1px solid var(--primary)',
    color: 'var(--primary)',
    fontSize: '12px',
    fontWeight: 700,
    padding: '0px 5px',
    ':hover': {
      color: 'var(--primary)'
    },
    ':active': {
      borderColor: 'var(--primary) !important'
    },
    ':focus': {
      boxShadow: '0 0 0 0.12rem rgba(var(--primary), 0.25)'
    }
  })
};

classes.miniTagAnimated = style([classes.miniTag, {
  border: '1px solid var(--orange)',
  color: 'var(--orange)',
  ':hover': {
    color: 'var(--orange)'
  }
}]);

classes.miniTagEditorsChoice = style([classes.miniTag, {
  border: `1px solid rgb(${SPARKLE_GOLD})`,
  color: `rgb(${SPARKLE_GOLD})`,
  ':hover': {
    color: `rgb(${SPARKLE_GOLD})`
  }
}]);

classes.sparkle = style({
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: 4,
  userSelect: 'none',
  lineHeight: 1,
  animationName: sparkleFlash,
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite'
});

export default classes;
