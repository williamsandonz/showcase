import { Module, Global } from '@nestjs/common';
import { ApiModule } from '@monorepo/api';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './filters/error.filter';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  imports: [ApiModule],
  exports: [],
})
export class CommonModule {}
