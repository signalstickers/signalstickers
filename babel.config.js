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
  ]
};
