export const productDotNetGettingStartedCode = {
stepOne:
  `
  npm install --save @sentry/node
  `,
stepTwo:
  `
  Sentry.init({ dsn: "https://<key>@sentry.io/<project>" });

  // The request handler must be the first middleware on the app
  app.use(Sentry.Handlers.requestHandler());
  `,
};
