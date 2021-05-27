import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationMembershipController } from './controllers/organisation-membership.controller';
import { OrganisationController } from './controllers/organisation.controller';
import { OrganisationPermission } from './entities';
import { OrganisationMembership } from './entities/organisation-membership.entity';
import { Organisation } from './entities/organisation.entity';
import { OrganisationMembershipService } from './providers/organisation-membership.service';
import { OrganisationService } from './providers/organisation.service';

@Module({
  controllers: [OrganisationController, OrganisationMembershipController],
  exports: [OrganisationMembershipService, OrganisationService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Organisation, OrganisationMembership, OrganisationPermission])],
  providers: [OrganisationMembershipService, OrganisationService],
})
export class OrganisationModule {}
