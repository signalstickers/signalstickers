/**
 * Allows us to import various non-JavaScript files without TS errors. Because
 * we use Webpack's raw-loader to import these files, we tell TypeScript that
 * any module with these extensions should be treated as strings.
 */
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.proto' {
  const content: string;
  export default content;
}

declare module '*.svg' {
  const value: React.StatelessComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}
