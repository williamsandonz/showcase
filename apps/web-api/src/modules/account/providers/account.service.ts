import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './../entities';
import { Repository } from 'typeorm';
import { SignUpRequestDto } from '../dto';
import { StripeService } from '../../stripe/providers';
import { IAccountAuthenticatedRequestDto, IAccountSummary } from '@monorepo/web-api-client';
import { OrganisationService } from '../../organisation/providers';
import { OrganisationMembershipService } from '../../organisation/providers/organisation-membership.service';
import { ProjectMembershipService } from '../../project/providers/project-membership.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private repo: Repository<Account>,
    private organisationService: OrganisationService,
    private organisationMembershipService: OrganisationMembershipService,
    private projectMembershipService: ProjectMembershipService,
    private stripeService: StripeService
  ) {}

  async delete(id: string): Promise<any> {
    return this.repo.delete(id);
  }

  async findById(id: string) {
    return this.repo.findOne(id);
  }

  async getHasSignedUp(id: string): Promise<boolean> {
    const account = await this.repo.findOne(id);
    return !!account;
  }

  async onAuthenticated(id: string, dto: IAccountAuthenticatedRequestDto): Promise<IAccountSummary> {
    const account = await this.repo.findOne(id);
    if (!account) {
      throw new NotFoundException();
    }
    if (dto.cookieUsageEnabled && !account.cookieUsageEnabled) {
      // User accepted cookie disclaimer prior to being authenticated, so update now
      account.cookieUsageEnabled = true;
      await this.repo.save(account);
    }
    return {
      cookieUsageEnabled: account.cookieUsageEnabled,
      name: account.name,
      organisationMemberships: (await this.organisationMembershipService.getMemberships(id)).map(membership => membership.transformForResponse()),
      projectMemberships: (await this.projectMembershipService.getMemberships(id)).map(membership => membership.transformForResponse())
    };
  }

  async signUp(dto: SignUpRequestDto): Promise<Account> {
    if (await this.repo.findOne(dto.id)) {
      throw new BadRequestException('User already exists');
    }
    // Deliberately creating customer before saving account so that worst case
    // we have an unassociated customer rather than an account without a customer.
    const stripeCustomer = await this.stripeService.createCustomer();
    const timestamp = new Date();
    const account = await this.repo.save({
      id: dto.id,
      dateJoined: timestamp,
      lastLoggedIn: timestamp,
      name: dto.name,
      stripeCustomerId: stripeCustomer.id,
    } as Partial<Account>);
    await this.organisationService.createOrganisationFromSignup(account, dto.name);
    return account;
  }

  async toggleCookieUsage(id: string, enable: boolean): Promise<void> {
    const account = await this.findById(id);
    account.cookieUsageEnabled = enable;
    await this.repo.save(account);
    return null;
  }
}
