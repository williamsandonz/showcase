import { Module } from '@nestjs/common';
import { SeedService } from './providers/seed.service';
import { DemoModule } from '../demo/demo.module';
import { OrganisationModule } from '../organisation/organisation.module';
import { SeedController } from './controllers/seed.controller';
import { ProjectModule } from '../project/project.module';

@Module({
  controllers: [SeedController],
  imports: [DemoModule, OrganisationModule, ProjectModule],
  providers: [SeedService],
})
export class SeedModule {}
