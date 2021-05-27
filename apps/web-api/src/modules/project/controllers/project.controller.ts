import { Controller, Post, Body } from '@nestjs/common';
import { ProjectService } from './../providers';
import { CognitoClaims } from '../../common/decorators';
import { IProject } from '@monorepo/web-api-client';
import { CreateProjectDto } from '../dto';

@Controller('project')
export class ProjectController {
  constructor(private service: ProjectService) {}

  @Post()
  async onCreate(
    @CognitoClaims() cognitoClaims,
    @Body() dto: CreateProjectDto
  ): Promise<IProject> {
    return this.service.create(cognitoClaims.sub, dto);
  }

}
