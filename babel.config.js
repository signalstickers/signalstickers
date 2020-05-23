module.exports = {
  extends: '@darkobits/ts-unified/dist/config/babel',
  presets: [
    require.resolve('linaria/babel')
  ],
  plugins: [
    'react-hot-loader/babel'
  ]
};
