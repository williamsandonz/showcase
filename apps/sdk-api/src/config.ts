import { LoggerOptions } from 'typeorm/logger/LoggerOptions';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { IApiSystemConfig, systemConfig } from '@monorepo/api-client';
import { INestServerConfig } from '@monorepo/api';
import { Environments } from '@monorepo/common';

export function getDatabaseConfig(): TypeOrmModuleOptions & Partial<PostgresConnectionOptions> {
  return {
    autoLoadEntities: true,
    database: process.env.SDK_API_POSTGRES_DB,
    cli: {
      migrationsDir: 'src/migrations',
    },
    host: process.env.SDK_API_POSTGRES_HOST,
    logging: process.env.SDK_API_POSTGRES_LOGGING as LoggerOptions,
    migrations: [],
    migrationsRun: false, // Migrations are run via CLI manually to avoid runtime computational cost.
    password: process.env.SDK_API_POSTGRES_PASSWORD,
    port: parseInt(process.env.SDK_API_POSTGRES_PORT, 10),
    synchronize: false,
    type: 'postgres',
    username: process.env.SDK_API_POSTGRES_USER,
  };
}

export const config = {
  sentry: {
    dsn: process.env.SDK_API_SENTRY_DSN,
  },
  server: {
    corsAllow: systemConfig.environment === Environments.LOCAL ? null : new RegExp(`^${process.env.WEB_URI_WITH_WWW}$`),
  },
  system: systemConfig,
} as ISdkApiConfig;

export interface ISdkApiConfig {
  sentry: ISentryConfig;
  server: INestServerConfig;
  system: IApiSystemConfig;
}

export interface ISentryConfig {
  dsn: string;
}
