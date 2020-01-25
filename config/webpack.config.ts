import path from 'path';

import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
// @ts-ignore (No type definitions exist for this package.)
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FetchStickerDataPlugin from 'plugins/FetchStickerDataPlugin';


/**
 * Resolve the path to our package root once. Used throughout configuration.
 */
const PKG_ROOT = path.resolve(__dirname, '..');


export default (env: string, argv: any): webpack.Configuration => {
  const config: webpack.Configuration = {};
  config.module = {rules: []};
  config.plugins = [];


  // ----- Entry / Output ------------------------------------------------------

  config.entry = {
    app: [
      '@babel/polyfill',
      'react-hot-loader/patch',
      path.resolve(PKG_ROOT, 'src', 'index.tsx')
    ]
  };

  config.output = {
    path: path.resolve(PKG_ROOT, 'dist'),
    filename: argv.mode === 'production' ? '[name]-[chunkhash].js' : '[name].js',
    chunkFilename: '[name]-[chunkhash].js'
  };


  // ----- Loaders -------------------------------------------------------------

  // TSLint (Development only).
  if (argv.mode === 'development') {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      enforce: 'pre',
      use: [{
        loader: 'tslint-loader',
        options: {
          configFile: path.resolve(PKG_ROOT, 'tslint.json'),
          tsConfigFile: path.resolve(PKG_ROOT, 'tsconfig.json'),
          formatter: 'codeFrame',
          typeCheck: true
        }
      }]
    });
  }


  // TypeScript & JavaScript files.
  config.module.rules.push({
    test: /\.(ts|tsx|js|jsx)$/,
    exclude: /node_modules/,
    use: [{
      loader: 'babel-loader',
      options: {
        cacheDirectory: true
      }
    }, {
      loader: 'linaria/loader',
      options: {
        sourceMap: argv.mode === 'development'
      }
    }]
  });


  // Stylesheets.
  config.module.rules.push({
    test: /\.css$/,
    use: [{
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: true
      }
    }, {
      loader: 'css-loader',
      options: {
        sourceMap: argv.mode === 'development'
      }
    }]
  });

  // Images.
  config.module.rules.push({
    test: /\.(png|jpg|gif|svg)$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'assets/[name].[hash].[ext]'
      }
    }]
  });

  // Text files.
  config.module.rules.push({
    test: /\.txt$/,
    use: [{
      loader: 'raw-loader'
    }]
  });

  // Fonts.
  config.module.rules.push({
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000
      }
    }]
  });


  // ----- Module Resolution ---------------------------------------------------

  config.resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  };


  // ----- Plugins -------------------------------------------------------------

  config.plugins.push(new webpack.NamedModulesPlugin());

  config.plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.resolve(PKG_ROOT, 'src', 'index.html'),
    inject: true
  }));

  if (argv.mode === 'development') {
    config.plugins.push(new FriendlyErrorsWebpackPlugin());

    config.plugins.push(new MiniCssExtractPlugin({
      filename: 'styles.css',
    }));
  }

  if (argv.mode === 'production') {
    config.plugins.push(new CopyWebpackPlugin([{
      // When performing a production build, instruct Webpack to copy all files
      // in the 'static' directory into the build directory.
      from: path.resolve(PKG_ROOT, 'static'),
      to: path.resolve(PKG_ROOT, 'dist')
    }]));

    config.plugins.push(new MiniCssExtractPlugin({
      filename: 'styles-[contenthash].css',
    }));

    config.plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true
    }));

    const ICON_BACKGROUND_COLOR = '#2090EA';

    config.plugins.push(new FaviconsWebpackPlugin({
      logo: path.resolve(PKG_ROOT, 'src', 'assets', 'favicon.png'),
      cache: true,
      inject: true,
      prefix: 'icons/',
      favicons: {
        appName: 'Signal Stickers',
        appDescription: '',
        version: '',
        developerName: '',
        developerURL: '',
        background: ICON_BACKGROUND_COLOR,
        theme_color: ICON_BACKGROUND_COLOR,
        icons: {
          android: {
            background: ICON_BACKGROUND_COLOR
          },
          appleIcon: {
            background: ICON_BACKGROUND_COLOR
          },
          appleStartup: {
            background: ICON_BACKGROUND_COLOR
          },
          coast: {
            background: ICON_BACKGROUND_COLOR
          },
          favicons: {
            background: ICON_BACKGROUND_COLOR
          },
          firefox: {
            background: ICON_BACKGROUND_COLOR
          },
          windows: {
            background: ICON_BACKGROUND_COLOR
          },
          yandex: {
            background: ICON_BACKGROUND_COLOR
          }
        }
      }
    }));
  }

  config.plugins.push(new FetchStickerDataPlugin({
    inputFile: path.resolve(PKG_ROOT, 'stickers.yml'),
    outputFile: 'stickerData.json'
  }));


  // ----- Dev Server ----------------------------------------------------------

  if (argv.mode === 'development') {
    config.devServer = {
      port: 8080,
      compress: true,
      historyApiFallback: true,
      disableHostCheck: true,
      host: '0.0.0.0',
      hot: true,
      inline: true,
      overlay: true,
      quiet: true
    };
  }


  // ----- Misc ----------------------------------------------------------------

  config.node = {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  };

  config.devtool = argv.mode === 'development' ? '#eval-source-map' : '#source-map';

  config.optimization = {
    minimize: argv.mode === 'production',
    splitChunks: {
      chunks: 'all'
    }
  };

  config.stats = 'minimal';

  return config;
};
