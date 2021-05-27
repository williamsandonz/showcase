import { getDatabaseConfig } from './config';
export default {
  ...getDatabaseConfig(),
  entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsRun: true,
}
