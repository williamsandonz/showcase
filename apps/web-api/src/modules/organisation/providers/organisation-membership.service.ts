import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organisation, OrganisationPermission } from './../entities';
import { Repository } from 'typeorm';
import { OrganisationMembership } from '../entities/organisation-membership.entity';
import { Account } from '../../account/entities';

@Injectable()
export class OrganisationMembershipService {

  constructor(
    @InjectRepository(OrganisationMembership)
    private membershipRepo: Repository<OrganisationMembership>,
    @InjectRepository(OrganisationPermission)
    private permissionRepo: Repository<OrganisationPermission>,
  ) {}

  async createMembership(
    account: Account,
    organisation: Organisation,
    permissions: OrganisationPermission[],
  ): Promise<void> {
    const membership = new OrganisationMembership(account, organisation, permissions, true);
    await this.membershipRepo.save(membership);
  }

  async getPermissions(): Promise<OrganisationPermission[]> {
    return this.permissionRepo.find();
  }

  async getMemberships(accountId: string): Promise<OrganisationMembership[]> {
    return this.membershipRepo.find({
      where: {
        account: accountId,
      }
    });
  }

  async setSelectedForAccount(accountId: string, organisationId: number): Promise<void> {
    const memberships = await this.membershipRepo.find({
      where: {
        account: accountId,
      }
    });
    if (!memberships.find(m => m.organisation.id === organisationId)) {
      throw new BadRequestException('No membership found matching that ID');
    }
    for (const membership of memberships) {
      membership.selected = membership.organisation.id === organisationId;
    }
    await this.membershipRepo.save(memberships);
  }



}
