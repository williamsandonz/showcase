import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { MoreThan } from 'typeorm';
import { OrganisationMembership } from '../entities/organisation-membership.entity';
import { constants, IOrganisationInvitationRequestDto, IOrganisationInvitationListResponseDto, OrganisationPermissionType, IOrganisationInvitationVm, IOrganisationInvitationRecipientStatusResponseDto } from '@monorepo/web-api-client';
import { invitationExpiryInDays, OrganisationInvitation } from '../entities/organisation-invitation.entity';
import { DatabaseService, MailerService } from '../../common/providers';
import { subDays } from 'date-fns';
import { config } from 'apps/web-api/src/config';
import { OrganisationMembershipService } from './organisation-membership.service';
import { AccountService } from '../../account/providers';
import { AcceptInvitationRequestDto } from '../dto';
import { Organisation } from '../entities';
import { Account } from '../../account/entities';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class OrganisationInvitationService {

  constructor(
    private accountService: AccountService,
    private databaseService: DatabaseService,
    private mailerService: MailerService,
    private membershipService: OrganisationMembershipService,
  ) {}

  private async accept(invitation: OrganisationInvitation) {
    if (!invitation) {
      throw new NotFoundException();
    }
    if(invitation.getExpiresInDays() < 0) {
      throw new ForbiddenException('Invitation has expired.');
    }
    if(invitation.accepted) {
      throw new ForbiddenException('Invitation already accepted');
    }
    invitation.accepted = true;
    invitation.dateAccepted = new Date();
    await this.databaseService.getRepository(OrganisationInvitation).save(invitation);
  }

  async acceptAsNewUser(id: string, dto: AcceptInvitationRequestDto): Promise<void> {
    const invitation = await this.getBySecret(dto.secret);
    const queryRunner = await this.databaseService.startTransaction();
    try {
      const permission = (await this.membershipService.getPermissions()).find(
        p => p.type === OrganisationPermissionType.USER
      ); // TODO get this from permissions sent upon invite
      const account = await this.accountService.create(invitation.email, id, dto.name, dto.timezone);
      await this.membershipService.createMembership(account, invitation.organisation, [permission]);
      await this.accept(invitation);
      await this.membershipService.setSelectedForAccount(id, invitation.organisation.id);
    } catch(e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await this.databaseService.releaseTransaction();
    }
  }

  async acceptAsExistingUser(id: string, secret: string): Promise<void> {
    if (!secret) {
      throw new BadRequestException();
    }
    const invitation = await this.getBySecret(secret);
    if(
      (await this.membershipService.getMemberships(id))
        .find(m => m.organisation.id === invitation.organisation.id)
    ) {
      throw new ForbiddenException('You are already a member of this organisation.');
    }
    const queryRunner = await this.databaseService.startTransaction();
    try {
      const account = await this.accountService.findById(id);
      const permission = (await this.membershipService.getPermissions()).find(
        p => p.type === OrganisationPermissionType.USER
      ); // TODO get this from permissions sent upon invite
      await this.membershipService.createMembership(account, invitation.organisation, [permission]);
      await this.accept(invitation);
      await this.membershipService.setSelectedForAccount(id, invitation.organisation.id);
    } catch(e) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(e);
    } finally {
      await this.databaseService.releaseTransaction();
    }
  }

  async delete(accountId: string, invitationId: number) {
    if (!(await this.membershipService.hasPermission(accountId, OrganisationPermissionType.ADMIN))) {
      throw new ForbiddenException();
    }
    return this.databaseService.getRepository(OrganisationInvitation).delete(invitationId);
  }

  async getForCurrentOrganisation(accountId: string): Promise<OrganisationInvitation[]> {
    const currentOrganisation = (await this.databaseService.getRepository(OrganisationMembership).find({
      where: {
        account: accountId,
      }
    })).find(m => m.selected).organisation;
    return this.databaseService.getRepository(OrganisationInvitation).find({
      relations: ['inviter'],
      where: {
        accepted: false,
        dateInvited: MoreThan(subDays(new Date(), invitationExpiryInDays)),
        organisation: currentOrganisation
      }
    });
  }

  async getForCurrentOrganisationPaginated(accountId: string, page: number, perPage: number): Promise<IOrganisationInvitationListResponseDto> {
    const currentOrganisation = (await this.databaseService.getRepository(OrganisationMembership).find({
      where: {
        account: accountId,
      }
    })).find(m => m.selected).organisation;
    const invitations = await this.databaseService.getRepository(OrganisationInvitation).findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        accepted: false,
        dateInvited: MoreThan(subDays(new Date(), invitationExpiryInDays)),
        organisation: currentOrganisation
      }
    });
    return {
      invitations: invitations[0].map(i => i.mapToViewModel()),
      total: invitations[1]
    }
  }

  async inviteToCurrentOrganisation(
    accountId: string,
    dto: IOrganisationInvitationRequestDto,
  ): Promise<OrganisationInvitation> {
    const account = await this.accountService.findById(accountId);
    const recipient = await this.accountService.findByEmail(dto.email);
    if (!(await this.membershipService.hasPermission(account.id, OrganisationPermissionType.ADMIN))) {
      throw new ForbiddenException();
    }
    const currentOrganisation = (await this.databaseService.getRepository(OrganisationMembership).find({
      where: {
        account,
      }
    })).find(m => m.selected).organisation;
    if(
      recipient &&
      (await this.membershipService.getMemberships(recipient.id))
        .find(m => m.organisation.id === currentOrganisation.id)
    ) {
      throw new ForbiddenException('User is already a member of this organisation.');
    }
    if(
      (await this.getForCurrentOrganisation(account.id))
      .find( m=> m.email === dto.email)
    ) {
      throw new ForbiddenException('An invitation has already been sent to this user. If they can\'t find it, please exit this dialog and go to "Invites" tab where you can resend it.');
    }
    const invitation = await this.databaseService.getRepository(OrganisationInvitation).save(new OrganisationInvitation(account, dto.email, currentOrganisation));
    console.log(`invitation URI sent: ${config.website.uri}/accept-invitation?secret=${invitation.secret}`);
    await this.sendEmail(currentOrganisation, dto.email, account, invitation);
    return invitation;
  }

  async getBySecret(secret: string): Promise<OrganisationInvitation> {
    const invitation = await this.databaseService.getRepository(OrganisationInvitation).findOne({
      where: {
        secret
      }
    });
    if (!invitation) {
      throw new NotFoundException();
    }
    return invitation;
  }

  async recipientStatus(secret: string): Promise<IOrganisationInvitationRecipientStatusResponseDto> {
    if (!secret) {
      throw new BadRequestException();
    }
    const invitation = await this.getBySecret(secret);
    return {
      accountExists: !!(await this.accountService.findByEmail(invitation.email)),
      invitation: invitation.mapToViewModel(true)
    }
  }

  async resend(accountId: string, invitationId: number) : Promise<IOrganisationInvitationVm> {
    const invitation = await this.databaseService.getRepository(OrganisationInvitation).findOne(invitationId);
    const account = await this.accountService.findById(accountId);
    const recipient = await this.accountService.findByEmail(invitation.email);
    if (!(await this.membershipService.hasPermission(account.id, OrganisationPermissionType.ADMIN))) {
      throw new ForbiddenException();
    }

    if (!invitation) {
      throw new NotFoundException();
    }
    if (invitation.accepted) {
      throw new ForbiddenException('Invitation already accepted');
    }
    const currentOrganisation = (await this.databaseService.getRepository(OrganisationMembership).find({
      where: {
        account,
      }
    })).find(m => m.selected).organisation;
    if(
      recipient &&
      (await this.membershipService.getMemberships(recipient.id))
        .find(m => m.organisation.id === currentOrganisation.id)
    ) {
      throw new ForbiddenException('User is already a member of this organisation.');
    }
    await this.sendEmail(currentOrganisation, invitation.email, account, invitation);
    return invitation.mapToViewModel();
  }

  async saveMany(memberships: OrganisationMembership[]): Promise<OrganisationMembership[]> {
    return this.databaseService.getRepository(OrganisationMembership).save(memberships);
  }

  private async sendEmail(
    organisation: Organisation,
    email: string,
    inviter: Account,
    invitation: OrganisationInvitation
  ): Promise<SentMessageInfo> {
    return this.mailerService.send(
      {
        to: email,
        subject: `${inviter.name} has invited you to join the ${organisation.name} organisation.`,
      },
      'invite',
      {
        acceptUri: `${config.website.uri}/accept-invitation?secret=${invitation.secret}`,
        appName: constants.appName,
        inviterName: inviter.name,
        organisationName: organisation.name,
      }
    );
  }



}
