import { BadRequestException, Injectable } from '@nestjs/common';
import { Organisation, OrganisationPermission } from './../entities';
import { Not } from 'typeorm';
import { OrganisationMembership } from '../entities/organisation-membership.entity';
import { Account } from '../../account/entities';
import { IOrganisationMemberListResponseDto, OrganisationPermissionType } from '@monorepo/web-api-client';
import { DatabaseService } from '../../common/providers';

@Injectable()
export class OrganisationMembershipService {

  constructor(
    private databaseService: DatabaseService,
  ) {}

  async createMembership(
    account: Account,
    organisation: Organisation,
    permissions: OrganisationPermission[],
  ): Promise<OrganisationMembership> {
    const membership = new OrganisationMembership(account, organisation, permissions, true);
    return this.databaseService.getRepository(OrganisationMembership).save(membership);
  }

  async delete(accountId: string): Promise<void> {
    const memberships = await this.getMemberships(accountId);
    const permissions: OrganisationPermission[] = [];
    permissions.concat(...memberships.map(m => m.permissions));
    await this.databaseService.getRepository(OrganisationPermission).remove(permissions);
    await this.databaseService.getRepository(OrganisationMembership).remove(memberships);
  }

  async hasPermission(accountId: string, permissionType: OrganisationPermissionType): Promise<boolean> {
    const selectedOrganisation = (await this.getMemberships(accountId)).find(m => m.selected);
    return selectedOrganisation.permissions.some(p => p.type === permissionType);
  }

  async getPermissions(): Promise<OrganisationPermission[]> {
    return this.databaseService.getRepository(OrganisationPermission).find();
  }

  async getMemberships(accountId: string): Promise<OrganisationMembership[]> {
    return this.databaseService.getRepository(OrganisationMembership).find({
      where: {
        account: accountId,
      }
    });
  }

  async setSelectedForAccount(accountId: string, organisationId: number): Promise<void> {
    const repo = this.databaseService.getRepository(OrganisationMembership);
    const memberships = await repo.find({
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
    await repo.save(memberships);
  }

  async getCurrentOrganisationsMembersPaginated(accountId: string, page: number, perPage: number): Promise<IOrganisationMemberListResponseDto> {
    const repo = this.databaseService.getRepository(OrganisationMembership);
    const currentOrganisation = (await repo.find({
      where: {
        account: accountId,
      }
    })).find(m => m.selected).organisation;
    const members = await repo.findAndCount({
      relations: ['account'],
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        account: Not(accountId),
        organisation: currentOrganisation
      }
    });
    return {
      members: members[0].map(m => m.mapToViewModel()),
      total: members[1]
    }
  }

  async saveMany(memberships: OrganisationMembership[]): Promise<OrganisationMembership[]> {
    return this.databaseService.getRepository(OrganisationMembership).save(memberships);
  }



}
