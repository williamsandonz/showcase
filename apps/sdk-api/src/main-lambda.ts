import { Server } from 'http';
import * as express from 'express';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { config } from './config';
import * as Sentry from '@sentry/serverless';
import * as SentryTracing from '@sentry/tracing';
import { ExpressAdapter } from '@nestjs/platform-express';
import { initNestApp } from './main-helper';
import { RewriteFrames } from '@sentry/integrations';

const binaryMimeTypes: string[] = [];

let cachedServer: Server;

if (config.sentry.dsn) {
  SentryTracing.addExtensionMethods(); // https://github.com/getsentry/sentry-javascript/issues/2984
  Sentry.AWSLambda.init({
    dsn: config.sentry.dsn,
    environment: config.system.environment,
    integrations: [new RewriteFrames()],
    release: config.system.release,
  });
}

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const app = initNestApp(
      await NestFactory.create(AppModule, new ExpressAdapter(expressApp)),
      [eventContext()]
    );
    await app.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}
/*
export const handler = Sentry.AWSLambda.wrapHandler(async (event, context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
});
*/


export const handler = async (event, context) => {

  const {
    requestContext: { connectionId, routeKey },
  } = event;

  console.log(event);
  console.log(context);

  if (routeKey === '$connect') {
    console.log('CONNECT!');
    // handle new connection
    return {
      statusCode: 200
    }
  }

  if (routeKey === '$disconnect') {
    console.log('DISCONNECT!');
    // handle disconnection
    return {
      statusCode: 200
    }
  }

  cachedServer = await bootstrapServer();

  console.log('DEFAULT - !'+routeKey);

  return proxy(cachedServer, event, context, 'PROMISE').promise;

};

/*
async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.TCP,
      },
    );
    await app.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}
bootstrapServer();*/
