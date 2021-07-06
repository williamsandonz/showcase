export const productNodeGettingStartedCode = {
expressStepOne:
  `
  npm install --save @sentry/node
  `,
expressStepTwo:
  `
  Sentry.init({ dsn: "https://<key>@sentry.io/<project>" });

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());
  `,
koaStepOne:
  `
  npm install --save @sentry/node
  `,
koaStepTwo:
  `
  import Koa from "koa";
  import * as Sentry from "@sentry/node";

  // or using CommonJS
  // const Koa = require('koa');
  // const Sentry = require('@sentry/node');

  const app = new Koa();
  `
};
