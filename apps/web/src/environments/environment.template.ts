const environmentName: string = '${GLOBAL_ENVIRONMENT}';

export const environment = {
  analyticsTrackingCode: '${GOOGLE_ANALYTICS_TRACKING_CODE}',
  cognito: {
    clientId: '${GLOBAL_COGNITO_USER_POOL_CLIENT_ID}',
    oAuth: {
      callbackLogin: '${GLOBAL_COGNITO_OAUTH_CALLBACK_LOGIN}',
      callbackLogout: '${GLOBAL_COGNITO_OAUTH_CALLBACK_LOGOUT}',
      domain: '${GLOBAL_COGNITO_USER_POOL_DOMAIN}.auth.${GLOBAL_AWS_REGION}.amazoncognito.com',
      scopes: '${GLOBAL_COGNITO_CLIENT_OAUTH_SCOPES}'.split(' '),
    },
    poolId: '${GLOBAL_COGNITO_USER_POOL_ID}',
    region: '${GLOBAL_AWS_REGION}',
  },
  email: {
    sales: '${GLOBAL_EMAIL_SALES}',
    support: '${GLOBAL_EMAIL_SUPPORT}',
  },
  enableProdMode: false,
  environmentName: environmentName,
  exceptions: {
    sentryDsn: '${WEB_SENTRY_DSN}',
  },
  recaptchaSiteKey: '${WEB_RECAPTCHA_SITE_KEY}',
  sdkApiUri: environmentName === 'local' ? 'https://localhost:3001' : '${SDK_API_URI}',
  stripe: {
    publishableKey: '${WEB_STRIPE_PUBLISHABLE_KEY}',
  },
  system: {
    environment: '${GLOBAL_ENVIRONMENT}',
    gitCommit: '${GLOBAL_GIT_COMMIT}',
    githubRunNumber: '${GLOBAL_GITHUB_RUN_NUMBER}',
    release: '${RELEASE}',
  },
  webApiUri: environmentName === 'local' ? 'https://localhost:3000' : '${WEB_API_URI}',
};
