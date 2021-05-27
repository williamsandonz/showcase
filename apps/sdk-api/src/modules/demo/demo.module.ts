import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { DemoGateway } from './providers/demo.gateway';
import { Demo } from './entities/demo.entity';

@Module({
  controllers: [],
  exports: [TypeOrmModule],
  imports: [CommonModule, TypeOrmModule.forFeature([Demo])],
  providers: [DemoGateway],
})
export class DemoModule {}
