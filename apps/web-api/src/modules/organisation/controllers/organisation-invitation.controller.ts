import { IOrganisationInvitationListResponseDto, IOrganisationInvitationRecipientStatusResponseDto, IOrganisationInvitationRequestDto, IOrganisationInvitationVm } from '@monorepo/web-api-client';
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CognitoClaims, IgnoreAuthentication } from '../../common/decorators';
import { AcceptInvitationRequestDto } from '../dto';
import { OrganisationInvitationService } from '../providers/organisation-invitation.service';

@Controller('organisation-invitations')
export class OrganisationInvitationController {

  constructor(private service: OrganisationInvitationService) {}

  @Post('accept-as-new-user')
  async onAcceptInvitationAsNewUser(
    @CognitoClaims() cognitoClaims,
    @Body() dto: AcceptInvitationRequestDto,
  ): Promise<void> {
    await this.service.acceptAsNewUser(cognitoClaims.sub, dto);
  }

  @Post('accept-as-existing-user/:secret')
  async onAcceptInvitationAsExistingUser(
    @CognitoClaims() cognitoClaims,
    @Param('secret') secret: string,
  ): Promise<void> {
    await this.service.acceptAsExistingUser(cognitoClaims.sub, secret);
  }

  @Get()
  async onGet(
    @CognitoClaims() cognitoClaims,
    @Query() query: any
  ): Promise<IOrganisationInvitationListResponseDto> {
    return this.service.getForCurrentOrganisationPaginated(
      cognitoClaims.sub,
      parseInt(query.page, 10),
      parseInt(query.per_page, 10)
    );
  }

  @Delete()
  async onDelete(
    @CognitoClaims() cognitoClaims,
    @Query('id') id: string
  ): Promise<void> {
    await this.service.delete(
      cognitoClaims.sub,
      parseInt(id, 10)
    );
  }

  @Post('invite')
  async onInvite(
    @CognitoClaims() cognitoClaims,
    @Body() dto: IOrganisationInvitationRequestDto,
  ): Promise<IOrganisationInvitationVm> {
    return (await this.service.inviteToCurrentOrganisation(cognitoClaims.sub, dto)).mapToViewModel();
  }

  @Get('recipient-status/:secret')
  @IgnoreAuthentication()
  async onInvitationRecipientStatus(@Param('secret') secret: string): Promise<IOrganisationInvitationRecipientStatusResponseDto> {
    return this.service.recipientStatus(secret);
  }

  @Post('resend/:id')
  async onResendInvitation(
    @CognitoClaims() cognitoClaims,
    @Param('id') invitationId: string,
  ): Promise<IOrganisationInvitationVm> {
    return this.service.resend(cognitoClaims.sub, parseInt(invitationId, 10));
  }

}
