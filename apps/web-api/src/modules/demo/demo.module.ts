import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { DemoController } from './controllers/demo.controller';
import { Demo } from './entities/demo.entity';
import { DemoService } from './providers/demo.service';

@Module({
  controllers: [DemoController],
  exports: [TypeOrmModule],
  imports: [CommonModule, TypeOrmModule.forFeature([Demo])],
  providers: [DemoService],
})
export class DemoModule {}
