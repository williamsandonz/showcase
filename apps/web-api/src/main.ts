import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { initNestApp } from './main-helper';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const certificatePath = `${__dirname}/assets/local-ssl-certs`;
  const app = initNestApp(
    await NestFactory.create(AppModule, {
      httpsOptions: {
        key: fs.readFileSync(`${certificatePath}/key.pem`),
        cert: fs.readFileSync(`${certificatePath}/cert.pem`),
      },
    })
  );
  const port = 3000;
  await app.listen(port, async () => {
    Logger.log('Listening at https://localhost:' + port + '/');
  });
}

bootstrap();
