const path = require('path');


const PKG_ROOT = path.resolve(__dirname, '..');


const EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'node'];

const ALWAYS_IGNORE = [
  `${PKG_ROOT}/dist`,
  '/node_modules/'
];


module.exports = {
  rootDir: PKG_ROOT,
  testEnvironment: 'node',
  testRegex: '^.+\\.spec.*$',
  testPathIgnorePatterns: ALWAYS_IGNORE,
  coveragePathIgnorePatterns: ALWAYS_IGNORE,
  moduleFileExtensions: [...EXTENSIONS, 'json'],
  collectCoverageFrom: [
    `${PKG_ROOT}/src/**/*.{${EXTENSIONS.join(',')}}`,
    `${PKG_ROOT}/tests/**/*.{${EXTENSIONS.join(',')}}`,
    '!**/node_modules/**',
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
};
