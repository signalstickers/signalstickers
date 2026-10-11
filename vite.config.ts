import path from 'path';

import { vite } from '@darkobits/tsx';
import { faviconsPlugin } from '@darkobits/vite-plugin-favicons';
import { loadEnv } from 'vite';
import type { Plugin } from 'vite';


/**
 * N.B. This should match the color used in icon assets.
 */
const BASE_COLOR = '#0B2857';


const PROD_API_URL = 'https://api.signalstickers.org/v1';

/**
 * The local Django dev server. The Vite dev server proxies API requests to
 * it, so the frontend can stay same-origin (no CORS needed).
 */
// N.B. Use 127.0.0.1 (not localhost) so the proxy connects over IPv4; the
// Django dev server listens on 127.0.0.1 and "localhost" may resolve to ::1.
const LOCAL_API_URL = 'http://127.0.0.1:8000/v1';

/**
 * The path under which the API is exposed to the browser in dev mode. The
 * Vite dev server proxies it to the backend selected by the
 * SIGNALSTICKERS_DEV_API env variable (see .env / .env.local).
 */
const DEV_API_PATH = '/api';

/**
 * The Vite dev server.
 */
const DEV_SERVER_URL = 'http://localhost:5173';


/**
 * The CSP in index.html is static, so we patch it at serve time to allow
 * the dev server's own origin in `connect-src`.
 */
function devCspPlugin(): Plugin {
  return {
    name: 'dev-csp',
    apply: 'serve',
    transformIndexHtml(html) {
      const devServer = new URL(DEV_SERVER_URL);
      const origins = new Set([devServer.origin]);
      // The browser may be served over http even if the dev server supports https.
      if (devServer.protocol === 'https:') {
        origins.add(`http://${devServer.host}`);
      }
      return html.replace(
        /connect-src 'self'/,
        `connect-src 'self' ${[...origins].join(' ')}`
      );
    }
  };
}


export default vite.react(({ config, srcDir, packageJson, mode }) => {
  config.define = {
    ...config.define,
    // In dev mode, the API is accessed relative to the dev server's own
    // origin, so requests are same-origin and get proxied transparently.
    'import.meta.env.SIGNALSTICKERS_API_URL': mode === 'development'
      ? `"${DEV_API_PATH}"`
      : `"${PROD_API_URL}"`
  };


  // ----- Icons & Startup Screens ---------------------------------------------

  config.plugins.push(faviconsPlugin({
    appName: 'Signal Stickers',
    version: packageJson.version,
    appDescription: packageJson.description ?? '',
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


  config.plugins.push(devCspPlugin());


  // ----- Dev Server ----------------------------------------------------------

  // The backend the dev server proxies API requests to, selected by the
  // SIGNALSTICKERS_DEV_API env variable (see .env / .env.local).
  const env = loadEnv(mode, process.cwd(), '');
  const devApiTarget = env.SIGNALSTICKERS_DEV_API === 'local'
    ? LOCAL_API_URL
    : PROD_API_URL;

  config.server.port = Number(new URL(DEV_SERVER_URL).port);
  config.server.proxy = {
    // N.B. Proxy keys are URL paths, not full URLs.
    [DEV_API_PATH]: {
      target: new URL(devApiTarget).origin,
      // The path prefix used by the browser (/api) differs from the one used
      // by the backends (/v1), so rewrite it.
      rewrite: path => path.replace(/^\/api/, new URL(devApiTarget).pathname),
      changeOrigin: false,
      headers: {
        host: new URL(devApiTarget).host
      }
    }
  };
});
