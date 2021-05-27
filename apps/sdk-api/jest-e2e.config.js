// NB: This approach was done bespoke and may not follow best practice
// It inherits from jest.config.js and it's parent which may not be wise
// If issues check against a new project's config generated by Nest CLI
module.exports = {
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/sdk-api',
  displayName: 'sdk-api',
  testRegex: "\\.e2e.spec.ts$",
  testMatch: null,
  testTimeout: 15000,
};
