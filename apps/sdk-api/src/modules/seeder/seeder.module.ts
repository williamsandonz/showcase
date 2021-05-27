import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { DemoModule } from '../demo/demo.module';

@Module({
  imports: [DemoModule],
  providers: [SeederService],
})
export class SeederModule {}
