const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');
const copyPlugin = require('copy-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const SentryPlugin = require('@sentry/webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

function config(
  context = __dirname,
  sentryProject,
  hasTypeOrm,
) {
  const name = path.basename(context);
  if (!name) {
    console.error('No name provided');
    return process.exit(1);
  }

  const tsConfig = path.join(context, `tsconfig.app.json`);

  const appDist = path.join(__dirname, `dist/apps`, name);



  return {
    context,
    // Uncomment below if you want to inspect source maps locally but should not be enabled on production
    // To keep lambda bundle size down
    devtool: 'source-map',
    entry: slsw.lib.entries,
    mode: process.env.GLOBAL_ENVIRONMENT === 'local' ? 'development' : 'production',
    target: 'node',
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        {
          test: /\.(tsx?)$/,
          loader: 'ts-loader',
          exclude: [
            [
              path.resolve(__dirname, 'node_modules'),
              path.resolve(__dirname, '.serverless'),
              path.resolve(__dirname, '.webpack'),
              path.resolve(__dirname, 'dist'),
            ],
          ],
          options: {
            configFile: tsConfig,
          },
        }
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true
          }
        })
      ]
    },
    output: {
      libraryTarget: 'umd',
      path: appDist,
      filename: '[name].js',
      //sourceMapFilename: '[file].map',
    },
    plugins: [
      new copyPlugin({
        patterns: [
          { from: 'src/assets', to: 'src/assets' },
        ],
      }),
      new SentryPlugin({
        org: process.env.GLOBAL_SENTRY_ORGANISATION_SLUG,
        project: sentryProject,
        release: process.env.RELEASE,
        include: appDist,
      }),
      // Solves this issue: https://github.com/nestjs/nest/issues/1706
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const blacklist = getModulesToIgnore(hasTypeOrm);
          return blacklist.includes(resource);
        },
      }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsConfigPathsPlugin({
          configFile: tsConfig,
        }),
      ]
    },
  };
}

function getModulesToIgnore(hasTypeOrm) {
  const base = [
    '@google-cloud/common',
    '@sap/hana-client',
    '@nestjs/microservices',
    '@nestjs/microservices/microservices-module',
    'bufferutil',
    'cache-manager',
    'google-gax',
    'hdb-pool',
    'utf-8-validate',
  ];
  const typeOrmModules = [
    'amqp-connection-manager',
    'amqplib',
    'better-sqlite3',
    'google-gax',
    'grpc',
    'ioredis',
    'kafkajs',
    'mqtt',
    'mongodb',
    'mssql',
    'mysql',
    'mysql2',
    'nats',
    'oracledb',
    'react-native-sqlite-storage',
    'redis',
    'pg-native',
    'pg-query-stream',
    'sqlite3',
    'sql.js',
    'typeorm-aurora-data-api-driver',
  ];
  let modules = [ ...base ];
  if(hasTypeOrm) {
    modules = [
      ...modules,
      ...typeOrmModules
    ];
  }
  return modules;
}


module.exports = config;
