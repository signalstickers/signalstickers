module.exports = {
  extends: '@darkobits/ts-unified/dist/config/babel',
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'entry',
      corejs: 3
    }],
    require.resolve('linaria/babel')
  ],
  plugins: [
    'react-hot-loader/babel'
  ],
  // Ensures Webpack comments are not prematurely removed by Babel. Comments
  // will still be stripped by the minifier in production builds.
  comments: true
};
