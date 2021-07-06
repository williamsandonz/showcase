import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';
import { CommonModule } from '../common/common.module';
import { OrganisationInvitationController } from './controllers/organisation-invitation.controller';
import { OrganisationMembershipController } from './controllers/organisation-membership.controller';
import { OrganisationController } from './controllers/organisation.controller';
import { OrganisationPermission } from './entities';
import { OrganisationInvitation } from './entities/organisation-invitation.entity';
import { OrganisationMembership } from './entities/organisation-membership.entity';
import { Organisation } from './entities/organisation.entity';
import { OrganisationInvitationService } from './providers/organisation-invitation.service';
import { OrganisationMembershipService } from './providers/organisation-membership.service';
import { OrganisationService } from './providers/organisation.service';

const providers = [
  OrganisationInvitationService,
  OrganisationMembershipService,
  OrganisationService
];

@Module({
  controllers: [OrganisationController, OrganisationInvitationController, OrganisationMembershipController],
  exports: [...providers, TypeOrmModule],
  imports: [AccountModule, CommonModule, TypeOrmModule.forFeature([Organisation, OrganisationInvitation, OrganisationMembership, OrganisationPermission])],
  providers: [...providers],
})
export class OrganisationModule {}
