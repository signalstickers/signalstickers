const path = require('path');

module.exports = require('@darkobits/ts-unified/dist/config/jest')({
  rootDir: path.resolve(__dirname, '..'),
  setupFilesAfterEnv: ['jest-expect-message'],
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
    'node',
    'yml'
  ],
  clearMocks: true,
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 95,
      functions: 100,
      lines: 100
    }
  }
});
