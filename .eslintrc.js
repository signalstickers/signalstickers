module.exports = {
  extends: [
    require.resolve('@darkobits/ts-unified/dist/config/eslint-react')
  ],
  rules: {
    'jsx-a11y/no-autofocus': 'off',
    'no-console': 'off'
  }
};
