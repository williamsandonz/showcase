import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SignUpRequestDto } from '../dto';
import { IAccountAuthenticatedRequestDto, IUserEditDetailsRequestDto, IUserSummaryVm } from '@monorepo/web-api-client';
import { OrganisationService } from '../../organisation/providers';
import { OrganisationMembershipService } from '../../organisation/providers/organisation-membership.service';
import { ProjectMembershipService } from '../../project/providers/project-membership.service';
import { DatabaseService } from '../../common/providers';
import { OrganisationInvitationService } from '../../organisation/providers/organisation-invitation.service';
import { AccountService } from '../../account/providers';
import { Account } from '../../account/entities';

@Injectable()
export class UserService {
  constructor(
    private accountService: AccountService,
    private databaseService: DatabaseService,
    private organisationInvitationService: OrganisationInvitationService,
    private organisationMembershipService: OrganisationMembershipService,
    private organisationService: OrganisationService,
    private projectMembershipService: ProjectMembershipService,
  ) {}

  async delete(id: string): Promise<any> {
    const queryRunner = await this.databaseService.startTransaction();
    try {
      await this.projectMembershipService.deleteMembershipsForAccount(id);
      await this.organisationMembershipService.delete(id);
      await this.accountService.delete(id);
    } catch(e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await this.databaseService.releaseTransaction();
    }
  }

  async editDetails(id: string, dto: IUserEditDetailsRequestDto): Promise<void> {
    const account = await this.accountService.findById(id);
    account.name = dto.name;
    account.timezone = dto.timezone;
    await this.accountService.save(account);
  }

  async editEmail(id: string, email: string): Promise<void> {
    if (!email) {
      throw new BadRequestException();
    }
    const account = await this.accountService.findById(id);
    account.email = email;
    await this.accountService.save(account);
  }

  async getHasSignedUp(id: string): Promise<boolean> {
    const account = await this.accountService.findById(id);
    return !!account;
  }

  async onAuthenticated(id: string, dto: IAccountAuthenticatedRequestDto): Promise<IUserSummaryVm> {
    const account = await this.accountService.findById(id);
    if (!account) {
      throw new NotFoundException();
    }
    if (dto.cookieUsageEnabled && !account.cookieUsageEnabled) {
      // User accepted cookie disclaimer prior to being authenticated, so update now
      account.cookieUsageEnabled = true;
      await this.accountService.save(account);
    }
    const organisationMemberships = await this.organisationMembershipService.getMemberships(id);
    const projectMemberships = await this.projectMembershipService.getMembershipsForAccount(id);
    return {
      cookieUsageEnabled: account.cookieUsageEnabled,
      dateJoined: account.dateJoined,
      name: account.name,
      organisationMemberships: organisationMemberships.map(membership => membership.mapToViewModel()),
      projectMemberships: projectMemberships
        .filter(m => m.project.organisation.id === organisationMemberships.find(m => m.selected).organisation.id)
        .map(membership => membership.mapToViewModel()),
      timezone: account.timezone,
    };
  }

  async signUp(dto: SignUpRequestDto): Promise<Account> {
    const queryRunner = await this.databaseService.startTransaction();
    try {
      const account = await this.accountService.create(dto.email, dto.id, dto.name, dto.timezone);
      await this.organisationService.createOrganisationFromSignup(account, dto.organisation);
      return account;
    } catch(e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await this.databaseService.releaseTransaction();
    }
  }

  async toggleCookieUsage(id: string, enable: boolean): Promise<void> {
    const account = await this.accountService.findById(id);
    account.cookieUsageEnabled = enable;
    await this.databaseService.getRepository(Account).save(account);
    return null;
  }

}
