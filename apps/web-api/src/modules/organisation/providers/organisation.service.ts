import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Organisation } from './../entities';
import { Account } from '../../account/entities';
import { OrganisationMembershipService } from './organisation-membership.service';
import { IOrganisationMembershipVm, OrganisationPermissionType } from '@monorepo/web-api-client';
import { DatabaseService, UtilityService } from '../../common/providers';
import { OrganisationEditDetailsRequestDto } from '../dto';
import { CreateOrganisationDto } from '../dto/create-organisation.dto';
import { OrganisationMembership } from '../entities/organisation-membership.entity';

@Injectable()
export class OrganisationService {

  constructor(
    private databaseService: DatabaseService,
    private membershipService: OrganisationMembershipService,
    private utilityService: UtilityService,
  ) {}

  async create(accountId: string, dto: CreateOrganisationDto): Promise<IOrganisationMembershipVm> {
    const queryRunner = await this.databaseService.startTransaction();
    try {
      const organisation = await this.databaseService.getRepository(Organisation).save(
        new Organisation(dto.name, this.utilityService.urlify(dto.name))
      );
      const permissions = (await this.membershipService.getPermissions()).filter(
        permission => permission.type === OrganisationPermissionType.ADMIN
      );
      const existingMemberships = await this.membershipService.getMemberships(accountId);
      this.membershipService.saveMany(existingMemberships.map((membership: OrganisationMembership) => {
        membership.selected = false;
        return membership;
      }));
      const membership = await this.membershipService.createMembership({ id: accountId } as Account, organisation, permissions);
      return membership.mapToViewModel();
    } catch(e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await this.databaseService.releaseTransaction();
    }
  }

  async createOrganisationFromSignup(
    account: Account,
    organisationName: string,
  ): Promise<void> {
    const organisation = await this.databaseService.getRepository(Organisation).save({
      name: organisationName,
      slug: this.utilityService.urlify(organisationName)
    } as Organisation);
    const permissions = (await this.membershipService.getPermissions()).filter(
      permission => permission.type === OrganisationPermissionType.ADMIN
    );
    await this.membershipService.createMembership(account, organisation, permissions)
  }

  async editDetails(accountId: string, dto: OrganisationEditDetailsRequestDto): Promise<void> {
    const repo = this.databaseService.getRepository(Organisation);
    const membership = (await this.membershipService
      .getMemberships(accountId))
      .find(m => m.selected);
    if(!membership.permissions.some(p => p.type === OrganisationPermissionType.ADMIN)) {
      throw new ForbiddenException();
    }
    const organisation = await repo.findOne(membership.organisation.id);
    organisation.name = dto.name;
    organisation.slug = dto.slug;
    await repo.save(organisation);
  }

}
