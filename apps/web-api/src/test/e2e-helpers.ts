import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { getDatabaseConfig  } from './../config';
import { LoggerOptions } from 'typeorm'
import { INestApplication } from '@nestjs/common';

export function getDatabaseConfigForE2E(): TypeOrmModuleOptions & Partial<PostgresConnectionOptions> {
  const dbConfig = getDatabaseConfig();
  return {
    ...dbConfig,
    dropSchema: true,
    host: '0.0.0.0',
    logging: 'error' as LoggerOptions,
    migrations: [],
    migrationsRun: false,
    port: parseInt(process.env.WEB_API_POSTGRES_PORT_E2E, 10),
    synchronize: true,
  };
}

export async function seedGlobal(app: INestApplication) {
  // TODO: You can setup global seed data here
}
