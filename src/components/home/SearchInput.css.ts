import { style } from '@vanilla-extract/css';


const classes: Record<string, string> = {
  searchClear: style({
    transition: 'opacity 0.15s ease-in-out'
  }),
  searchClearIcon: style({
    opacity: 0.6,
    transition: 'opacity 0.2s ease-in-out, transform 0.1s ease',
    ':hover': {
      opacity: 1
    }
  }),
  miniTag: style({
    padding: '0px 5px',
    color: 'var(--bs-primary) !important',
    ':focus': {
      boxShadow: '0px 0px 0px 2px rgba(var(--bs-primary-rgb), 0.25)'
    }
  })
};

classes.miniTagAnimated = style([classes.miniTag, {
  border: '1px solid var(--bs-orange) !important',
  color: 'var(--bs-orange) !important',
  ':hover': {
    color: 'var(--bs-orange)'
  },
  ':focus': {
    // N.B. Bootstrap does not define a --bs-orange-rgb CSS variable, so we have
    // to define it explicitly.
    boxShadow: '0px 0px 0px 2px rgba(253, 126, 20, 0.25)'
  }
}]);

classes.miniTagEditorsChoice = style([classes.miniTag, {
  border: '1px solid rgb(148, 0, 211) !important',
  color: 'rgb(148, 0, 211) !important',
  ':hover': {
    color: 'rgb(148, 0, 211)'
  },
  ':focus': {
    boxShadow: '0px 0px 0px 2px rgba(148, 0, 211, 0.25)'
  }
}]);


export default classes;
