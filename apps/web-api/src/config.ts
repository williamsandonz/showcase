import { IApiSystemConfig, systemConfig } from '@monorepo/api-client';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { INestServerConfig } from '@monorepo/api';
import { Environments } from '@monorepo/common';

export function getDatabaseConfig(): TypeOrmModuleOptions & Partial<PostgresConnectionOptions> {
  return {
    autoLoadEntities: true,
    database: process.env.WEB_API_POSTGRES_DB,
    cli: {
      migrationsDir: 'src/migrations',
    },
    host: process.env.WEB_API_POSTGRES_HOST,
    logging: process.env.WEB_API_POSTGRES_LOGGING as LoggerOptions,
    migrations: [],
    migrationsRun: false, // Migrations are run via CLI manually to avoid runtime computational cost.
    password: process.env.WEB_API_POSTGRES_PASSWORD,
    port: parseInt(process.env.WEB_API_POSTGRES_PORT, 10),
    synchronize: false,
    type: 'postgres',
    username: process.env.WEB_API_POSTGRES_USER,
  };
}

export const config = {
  aws: {
    cognito: {
      clientId: process.env.GLOBAL_COGNITO_USER_POOL_CLIENT_ID,
      poolId: process.env.GLOBAL_COGNITO_USER_POOL_ID,
    },
    region: process.env.GLOBAL_AWS_REGION,
  },
  email: {
    noReply: process.env.WEB_API_EMAIL_NO_REPLY,
    support: process.env.GLOBAL_EMAIL_SUPPORT,
  },
  sentry: {
    dsn: process.env.WEB_API_SENTRY_DSN,
  },
  server: {
    corsAllow: systemConfig.environment === Environments.LOCAL ? null : new RegExp(`${process.env.WEB_API_WITH_WWW}$`),
  },
  smtp: {
    debug: process.env.WEB_API_SMTP_DEBUG === 'true',
    host: process.env.WEB_API_SMTP_HOST,
    port: parseInt(process.env.WEB_API_SMTP_PORT, 10),
    username: process.env.WEB_API_SMTP_USERNAME,
    password: process.env.WEB_API_SMTP_PASSWORD,
  },
  stripe: {
    secret: process.env.WEB_API_STRIPE_SECRET,
  },
  system: systemConfig,
  website: {
    uri: `https://${process.env.WEB_URI_WITH_WWW}`,
  },
} as IWebHttpApiConfig;

export interface IWebHttpApiConfig {
  aws: IAwsConfig;
  email: IEmailConfig;
  sentry: ISentryConfig;
  server: INestServerConfig;
  smtp: ISmtpConfig;
  stripe: IStripeConfig;
  system: IApiSystemConfig;
  website: IWebsiteConfig;
}

export interface IAwsConfig {
  cognito: ICognitoConfig;
  region: string;
}

export interface ICognitoConfig {
  clientId: string;
  poolId: string;
}

export interface IEmailConfig {
  noReply: string;
  support: string;
}

export interface ISentryConfig {
  dsn: string;
}

export interface ISmtpConfig {
  debug: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface IStripeConfig {
  secret: string;
}
export interface IWebsiteConfig {
  uri: string;
}
