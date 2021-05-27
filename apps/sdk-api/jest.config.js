module.exports = {
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/sdk-api',
  displayName: 'sdk-api',
  testRegex: "\\.unit.spec.ts$",
  testMatch: null,
};
