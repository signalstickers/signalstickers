/**
 * Import typings for jQuery and Bootstrap's JavaScript (the source for which are
 * both loaded statically in index.html) from their respective @types packages.
 */
import 'bootstrap';
import 'jquery';

/**
 * Allows us to import various non-JavaScript files without TS errors. Because
 * we use Webpack's raw-loader to import these files, we tell TypeScript that
 * any module with these extensions should be treated as strings.
 */
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.proto' {
  const content: string;
  export default content;
}
