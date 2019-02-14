const paths = require('./tsconfig.json').compilerOptions.paths;

const moduleNameMapper = Object.keys(paths).map(key => {
  const newKey = `${key.split("*").join("(.*)")}$`;
  const newValue = paths[key].map(path =>
    path.split("*")
      .filter(e => e)
      .map((e, i) => `<rootDir>/${e}$${i+1}`)
      .join(""));

  return {
    [newKey]: newValue[0]
  };
}).reduce((acc, e) => ({ ...acc,
  ...e
}));

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/**/*Tests.[jt]s?(x)'],
  moduleNameMapper
};