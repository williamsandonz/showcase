import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoModule } from '../demo/demo.module';
import { CommonModule } from '../common/common.module';
import { getDatabaseConfig } from '../../config';

@Module({
  imports: [
    CommonModule,
    DemoModule,
    TypeOrmModule.forRoot(getDatabaseConfig()),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
