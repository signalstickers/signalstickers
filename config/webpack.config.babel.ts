import path from 'path';

import * as R from 'ramda';
import webpack from 'webpack';

// Plugins.
import FetchStickerDataPlugin from '@signalstickers/fetch-sticker-data-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import { FaviconWebpackPlugionOptions } from 'favicons-webpack-plugin/src/options';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// @ts-expect-error No declarations exist for this plugin.
import PreloadWebpackPlugin from 'preload-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';


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
      // As of Babel 7.4.0, @babel/polyfill has been deprecated in favor of
      // directly including core-js/stable (to polyfill ECMAScript features) and
      // regenerator-runtime/runtime (needed to use transpiled generator
      // functions).
      'core-js/stable',
      'regenerator-runtime/runtime',
      // Required in development to support hot-reloading.
      argv.mode === 'development' ? 'react-hot-loader/patch' : '',
      path.resolve(PKG_ROOT, 'src', 'index.tsx')
    ].filter(Boolean)
  };

  config.output = {
    path: path.resolve(PKG_ROOT, 'dist'),
    filename: argv.mode === 'production' ? '[name]-[chunkhash].js' : '[name].js',
    chunkFilename: '[name]-[chunkhash].js'
  };


  // ----- Loaders -------------------------------------------------------------

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
      loader: MiniCssExtractPlugin.loader
    }, {
      loader: 'css-loader',
      options: {
        sourceMap: argv.mode === 'development'
      }
    }]
  });

  // SVG.
  config.module.rules.push({
    test: /\.svg$/,
    use: [{
      loader: '@svgr/webpack'
    }]
  });

  // Other images.
  config.module.rules.push({
    test: /\.(png|jpg|gif)$/,
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

  // Modernizr.
  config.module.rules.push({
    type: 'javascript/auto',
    test: /modernizr-config\.json?$/,
    use: [{
      loader: 'modernizr-loader'
    }, {
      loader: 'json-loader'
    }]
  });


  // ----- Module Resolution ---------------------------------------------------

  config.resolve = {
    alias: {
      // This tells Webpack to load our Modernizr configuration file whenever we
      // import a module named 'modernizr'. The loader rule above will then
      // match our config file being loaded and pass it to modernizr-loader
      // which will create a custom Modernizr build per our configuration and
      // return the resulting JavaScript to the file that imported it.
      'modernizr$': path.resolve(PKG_ROOT, 'config', 'modernizr-config.json'),
      // Use the @hot-loader variant of react-dom in development to avoid this
      // issue: https://github.com/gatsbyjs/gatsby/issues/11934#issuecomment-469046186
      'react-dom': argv.mode === 'production' ? 'react-dom' : '@hot-loader/react-dom'
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  };


  // ----- Icons ---------------------------------------------------------------

  const iconsBaseConfig: Partial<FaviconWebpackPlugionOptions> = {
    mode: 'webapp',
    inject: true,
    prefix: 'icons/',
    favicons: {
      appName: 'Signal Stickers',
      appDescription: '',
      version: '',
      developerName: '',
      developerURL: '',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: false,
        firefox: false,
        windows: false,
        yandex: false
      }
    }
  };

  // Favicons.
  config.plugins.push(new FaviconsWebpackPlugin(R.mergeDeepRight(iconsBaseConfig, {
    logo: path.resolve(PKG_ROOT, 'src', 'assets', 'favicon.png'),
    favicons: {
      icons: {
        favicons: true,
        firefox: true,
        coast: true,
        yandex: true
      }
    }
  })));

  // App icon.
  config.plugins.push(new FaviconsWebpackPlugin(R.mergeDeepRight(iconsBaseConfig, {
    logo: path.resolve(PKG_ROOT, 'src', 'assets', 'app-icon.png'),
    favicons: {
      icons: {
        appleIcon: true,
        android: true
      }
    }
  })));

  // Apple startup splash screen.
  config.plugins.push(new FaviconsWebpackPlugin(R.mergeDeepRight(iconsBaseConfig, {
    logo: path.resolve(PKG_ROOT, 'src', 'assets', 'launch-screen.png'),
    favicons: {
      icons: {
        appleStartup: {
          // N.B. This is derived from Bootstrap's default 'primary' color.
          background: '#007BFF'
        }
      }
    }
  })));


  // ----- Plugins -------------------------------------------------------------

  config.plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.resolve(PKG_ROOT, 'src', 'index.html'),
    inject: true
  }));

  // Add resource hints to preload assets used in the initial chunk. This plugin
  // must be added after html-webpack-plugin.
  config.plugins.push(new PreloadWebpackPlugin({
    include: ['home']
  }));

  config.plugins.push(new MiniCssExtractPlugin({
    filename: argv.mode === 'production' ? '[name]-[contenthash].css' : 'styles.css'
  }));

  config.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: argv.mode === 'production'
  }));

  config.plugins.push(new FetchStickerDataPlugin({
    inputFile: path.resolve(PKG_ROOT, 'stickers.yml'),
    outputFile: 'stickerData.json'
  }));

  config.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(argv.mode)
  }));

  if (argv.mode === 'development') {
    config.plugins.push(new FriendlyErrorsWebpackPlugin());
  }

  if (argv.mode === 'production') {
    // Delete the build output directory before production builds.
    config.plugins.push(new CleanWebpackPlugin());

    config.plugins.push(new CopyWebpackPlugin({
      patterns: [{
        // When performing a production build, instruct Webpack to copy all
        // files in the 'static' directory into the build directory.
        from: path.resolve(PKG_ROOT, 'static'),
        to: path.resolve(PKG_ROOT, 'dist')
      }]
    }));

    // This runs ESLint and TypeScript as separate processes, dramatically
    // speeding-up build times.
    config.plugins.push(new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: true,
        files: './src/**/*.{ts,tsx,js,jsx}'
      },
      typescript: {
        enabled: true,
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        }
      }
    }));

    if (argv.analyze) {
      console.log('Performing bundle analysis. Bundle report will be opened in your default browser.');
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        // Use gzipped sizes in the report, because this is the amount of data
        // we will actually be sending to the user.
        defaultSizes: 'gzip'
      }));
    }
  }


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
