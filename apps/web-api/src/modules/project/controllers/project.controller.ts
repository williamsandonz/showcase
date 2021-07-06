import { Controller, Post, Body, Delete, Param, Query } from '@nestjs/common';
import { ProjectService } from './../providers';
import { CognitoClaims } from '../../common/decorators';
import { IProjectMembershipVm } from '@monorepo/web-api-client';
import { CreateProjectDto } from '../dto';
import { ProjectEditDetailsRequestDto } from '../dto/edit-details.dto';

@Controller('project')
export class ProjectController {
  constructor(private service: ProjectService) {}

  @Post()
  async onCreate(
    @CognitoClaims() cognitoClaims,
    @Body() dto: CreateProjectDto
  ): Promise<IProjectMembershipVm> {
    return this.service.create(cognitoClaims.sub, dto);
  }

  @Delete()
  async onDelete(@Query('id') id: string): Promise<any> {
    return this.service.delete(parseInt(id, 10));
  }

  @Post('edit-details')
  async onEditDetails(
    @CognitoClaims() cognitoClaims,
    @Body() dto: ProjectEditDetailsRequestDto
  ): Promise<void> {
    return this.service.editDetails(cognitoClaims.sub, dto);
  }

}
