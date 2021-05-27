import { INestApplication } from '@nestjs/common';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { config } from './config';

export function initNestApp(app: INestApplication, useThings = []): INestApplication {
  app.use([
    ...useThings,
    helmet(),
    rateLimit({
      windowMs: 5 * 60 * 1000, // Over 5 minutes
      max: 1500, // limit each IP to 5 requests per second
    }),
  ]);
  app.enableCors({
    origin: config.server.corsAllow || true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  return app;
}
