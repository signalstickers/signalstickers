module.exports = {
  extends: 'plugin:@darkobits/tsx',
  globals: {
    '$': 'readonly'
  },
  rules: {
    'no-console': 'off',
    'no-confusing-arrow': 'off',
    'jsx-a11y/no-onchange': 'off',
    'unicorn/prefer-array-some': 'off',
    // When this rule converts functions to variables, it uses `var`. This does
    // not appear to be configurable.
    'react/function-component-definition': 'off'
  }
};
