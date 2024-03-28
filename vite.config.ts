import path from 'node:path';

import { vite } from '@darkobits/tsx';
import { faviconsPlugin } from '@darkobits/vite-plugin-favicons';
import { visualizer } from 'rollup-plugin-visualizer';


/**
 * Used for generating background colors for icon assets, startup screens, and
 * sets the "theme-color" meta tag in index.html.
 */
const BASE_COLOR = '#0D6EFD';


const DEV_API_URL = '/api';
const PROD_API_URL = 'https://api.signalstickers.org/v1';


export default vite.react(({ config, srcDir, packageJson, mode, manualChunks }) => {
  config.define = {
    ...config.define,
    'import.meta.env.THEME_COLOR': `"${BASE_COLOR}"`,
    'import.meta.env.SIGNALSTICKERS_API_URL': mode === 'development'
      ? `"${DEV_API_URL}"`
      : `"${PROD_API_URL}"`
  };

  // ----- Code-Splitting ------------------------------------------------------

  // This splits some of our larger dependencies out of our vendor chunk to
  // keep chunk sizes under 500kB.
  manualChunks([{
    name: 'react-router-dom',
    vendor: true,
    include: ['react-router-dom', 'react-router', '@remix-run/router']
  }, {
    name: 'bootstrap',
    vendor: true,
    include: ['bootstrap', '@popperjs']
  }, {
    name: 'webp-hero',
    vendor: true,
    include: ['webp-hero']
  }, {
    name: 'protobufjs',
    vendor: true,
    include: ['protobufjs']
  }, {
    // Add all other other chunks from node_modules to a common 'vendor' chunk.
    name: 'vendor',
    vendor: true
  }]);


  // ----- Icons & Startup Screens ---------------------------------------------

  config.plugins.push(faviconsPlugin({
    appName: 'Signal Stickers',
    version: packageJson.version,
    appDescription: packageJson.description,
    developerURL: packageJson.homepage ?? '',
    theme_color: BASE_COLOR,
    icons: {
      favicons: {
        source: path.resolve(srcDir, 'assets', 'favicon.png')
      },
      appleIcon: {
        source: path.resolve(srcDir, 'assets', 'app-icon.png')
      },
      appleStartup: {
        source: path.resolve(srcDir, 'assets', 'launch-screen.png'),
        background: BASE_COLOR
      },
      android: {
        source: path.resolve(srcDir, 'assets', 'app-icon.png')
      }
    }
  }));


  // ----- Dev Server ----------------------------------------------------------

  config.server.proxy = {
    [DEV_API_URL]: {
      target: PROD_API_URL,
      rewrite: path => path.replace(/^\/api/, ''),
      changeOrigin: false,
      headers: {
        host: new URL(PROD_API_URL).host
      }
    }
  };

  // ----- Build Statistics ----------------------------------------------------

  config.plugins.push(visualizer({
    emitFile: true,
    filename: 'build-stats.html',
    template: 'sunburst',
    gzipSize: true
  }));
});
