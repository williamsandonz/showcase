import { IOrganisationMemberListResponseDto } from '@monorepo/web-api-client';
import { BadRequestException, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CognitoClaims } from '../../common/decorators';
import { OrganisationMembershipService } from '../providers';

@Controller('organisation-membership')
export class OrganisationMembershipController {

  constructor(private service: OrganisationMembershipService) {}

  @Post('select/:organisation')
  async onSelect(
    @CognitoClaims() cognitoClaims,
    @Param() params
  ): Promise<void> {
    const organisationId = params.organisation ? parseInt(params.organisation, 10) : null;
    if(!organisationId || isNaN(organisationId)) {
      throw new BadRequestException('Organisation param not provided');
    }
    return this.service.setSelectedForAccount(cognitoClaims.sub, organisationId);
  }

  @Get()
  async onCurrentMembers(
    @CognitoClaims() cognitoClaims,
    @Query() query: any
  ): Promise<IOrganisationMemberListResponseDto> {
    return this.service.getCurrentOrganisationsMembersPaginated(
      cognitoClaims.sub,
      parseInt(query.page, 10),
      parseInt(query.per_page, 10)
    );
  }

}
