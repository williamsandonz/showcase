import { Body, Controller, Post } from '@nestjs/common';
import { CognitoClaims } from '../../common/decorators';
import { OrganisationService } from './../providers';
import { OrganisationEditDetailsRequestDto } from '../dto';
import { CreateOrganisationDto } from '../dto/create-organisation.dto';
import { IOrganisationMembershipVm } from '@monorepo/web-api-client';

@Controller('organisation')
export class OrganisationController {

  constructor(private service: OrganisationService) {}

  @Post()
  async onCreate(
    @CognitoClaims() cognitoClaims,
    @Body() dto: CreateOrganisationDto
  ): Promise<IOrganisationMembershipVm> {
    return this.service.create(cognitoClaims.sub, dto);
  }

  @Post('edit-details')
  async onEditDetails(
    @CognitoClaims() cognitoClaims,
    @Body() dto: OrganisationEditDetailsRequestDto
  ): Promise<void> {
    return this.service.editDetails(cognitoClaims.sub, dto);
  }

}
