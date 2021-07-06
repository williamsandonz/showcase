import { IProjectMemberListResponseDto } from '@monorepo/web-api-client';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CognitoClaims } from '../../common/decorators';
import { ProjectMembershipService } from '../providers/project-membership.service';

@Controller('project-membership')
export class ProjectMembershipController {

  constructor(private service: ProjectMembershipService) {}

  @Get('members/:id')
  async onCurrentMembers(
    @CognitoClaims() cognitoClaims,
    @Param('id') projectId: string,
    @Query() query: any,
  ): Promise<IProjectMemberListResponseDto> {
    return this.service.getMembershipsForProjectPaginated(
      cognitoClaims.sub,
      parseInt(projectId, 10),
      parseInt(query.page, 10),
      parseInt(query.per_page, 10)
    );
  }
}
