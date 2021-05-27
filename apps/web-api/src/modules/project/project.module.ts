import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationModule } from '../organisation/organisation.module';
import { StripeModule } from '../stripe/stripe.module';
import { ProjectController } from './controllers/project.controller';
import { ProjectMembership, ProjectPermission } from './entities';
import { Project } from './entities/project.entity';
import { ProjectMembershipService } from './providers/project-membership.service';
import { ProjectService } from './providers/project.service';

@Module({
  controllers: [ProjectController],
  exports: [TypeOrmModule, ProjectService, ProjectMembershipService],
  imports: [OrganisationModule, StripeModule, TypeOrmModule.forFeature([Project, ProjectMembership, ProjectPermission])],
  providers: [ProjectService, ProjectMembershipService],
})
export class ProjectModule {}
