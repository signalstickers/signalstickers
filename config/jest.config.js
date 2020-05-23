const path = require('path');

module.exports = require('@darkobits/ts-unified/dist/config/jest')({
  rootDir: path.resolve(__dirname, '..'),
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
