module.exports = function (w) {

  return {
    files: [
      'packages/**/lib/**/*.ts',
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