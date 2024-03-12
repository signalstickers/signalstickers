import path from 'node:path';

import { vite } from '@darkobits/tsx';
import { faviconsPlugin } from '@darkobits/vite-plugin-favicons';


/**
 * N.B. This should match the color used in icon assets.
 */
const BASE_COLOR = '#0B2857';


const DEV_API_URL = '/api';
const PROD_API_URL = 'https://api.signalstickers.org/v1';


export default vite.react(({ config, srcDir, packageJson, mode }) => {
  config.define = {
    ...config.define,
    'import.meta.env.SIGNALSTICKERS_API_URL': mode === 'development'
      ? `"${DEV_API_URL}"`
      : `"${PROD_API_URL}"`
  };


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
});
