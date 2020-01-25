module.exports = {
  presets: [
    require.resolve('@babel/preset-env'),
    require.resolve('@babel/preset-typescript'),
    require.resolve('@babel/preset-react'),
    require.resolve('linaria/babel')
  ],
  plugins: [
    require.resolve('react-hot-loader/babel'),
    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
    require.resolve('@babel/plugin-proposal-optional-chaining'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-transform-runtime'),
    [require.resolve('babel-plugin-module-resolver'), {
      cwd: 'packagejson',
      root: ['./src'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    }]
  ],
  comments: false
};
