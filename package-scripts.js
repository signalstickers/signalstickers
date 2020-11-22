/**
 * This project uses NPS to manage its package scripts. For a complete list of
 * available scripts, run "npm run help". Most common scripts have been mapped
 * in package.json, allowing you to run "npm run scriptName". To run a script
 * not listed in package.json, you may either:
 *
 * (1) Run "npx nps scriptName"
 * (2) Install the NPS CLI globally by running "npm i -g nps", then run
 *     "nps scriptName".
 *
 * Protip: NPS matches against partial strings for script names. For example, to
 * run tests in watch mode, you can run "nps t.w".
 */
module.exports = require('@darkobits/ts-unified/dist/config/package-scripts')(({bin, npsUtils}) => {
  const scripts = {};

  scripts.test = {
    description: 'Run unit tests with Jest.',
    script: `${bin('jest')} --config=config/jest.config.js`
  };

  scripts.test.watch = {
    description: 'Run unit tests in watch mode.',
    script: `${scripts.test.script} --watch`
  };

  scripts.build = {
    description: 'Type-check the project, then compile it with Webpack.',
    script: 'NODE_ENV=production nps typeCheck && webpack --mode=production --config=config/webpack.config.babel.ts',
    analyze: {
      description: 'Build the project, then open a bundle analysis in the default browser.',
      script: 'webpack --analyze --mode=production --config=config/webpack.config.babel.ts'
    }
  };

  scripts.start = {
    description: 'Run the project in development mode using Webpack.',
    script: 'NODE_ENV=development webpack-dev-server --mode=development --config=config/webpack.config.babel.ts'
  };

  scripts.prepare = {
    script: npsUtils.series(
      scripts.build.script,
      scripts.test.script
    )
  };

  return {scripts};
});
