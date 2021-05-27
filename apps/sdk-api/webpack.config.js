const path = require('path');
const webpackConfig = require('../../webpack-nest');

const config = webpackConfig(
  __dirname,
  process.env.SDK_API_SENTRY_PROJECT,
  true,
);

module.exports = config;
