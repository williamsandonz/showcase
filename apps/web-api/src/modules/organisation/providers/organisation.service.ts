import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organisation } from './../entities';
import { Repository } from 'typeorm';
import { Account } from '../../account/entities';
import { OrganisationMembershipService } from './organisation-membership.service';
import { OrganisationPermissionType } from '@monorepo/web-api-client';

@Injectable()
export class OrganisationService {

  constructor(
    @InjectRepository(Organisation)
    private repo: Repository<Organisation>,
    private membershipService: OrganisationMembershipService,
  ) {}

  async createOrganisationFromSignup(
    account: Account,
    organisationName: string,
  ): Promise<void> {
    const organisation = await this.repo.save({
      name: organisationName,
    });
    const permissions = (await this.membershipService.getPermissions()).filter(
      permission => permission.type === OrganisationPermissionType.SUPER_USER
    );
    await this.membershipService.createMembership(account, organisation, permissions)
  }
}
