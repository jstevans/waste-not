var path = require('path');

var jestConfig = require('./jest.config');

console.log(JSON.stringify(jestConfig.moduleNameMapper));

module.exports = function (w) {

  return {
    files: [
      'packages/**/src/**/*.ts',
      {
        pattern: 'packages/**/test/**/*.ts',
        instrument: false
      },
      '!packages/**/test/**/*Tests.ts'
    ],

    tests: [
      'packages/**/test/**/*Tests.ts',
    ],

    env: {
      type: 'node'
    },

    compilers: {
      '**/*.ts?(x)': w.compilers.typeScript({
        isolatedModules: true
      })
    },

    // or any other supported testing framework:
    // https://wallabyjs.com/docs/integration/overview.html#supported-testing-frameworks
    testFramework: 'jest'
  };
};