module.exports = {
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/web-api',
  displayName: 'web-api',
  testRegex: "\\.unit.spec.ts$",
  testMatch: null,
};
