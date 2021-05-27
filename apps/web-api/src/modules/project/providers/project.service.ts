import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './../entities';
import { Repository } from 'typeorm';
import { ICreateProjectDto, IProject, OrganisationPermissionType } from '@monorepo/web-api-client';
import { OrganisationMembershipService } from '../../organisation/providers';
@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private repo: Repository<Project>,
    private organisationMembershipService: OrganisationMembershipService
  ) {}

  async create(accountId: string, dto: ICreateProjectDto): Promise<IProject> {
    const selectedOrganisation = (await this.organisationMembershipService.getMemberships(accountId))
      .find(m => m.selected);
    if(!selectedOrganisation.permissions.some(p => p.type === OrganisationPermissionType.SUPER_USER)) {
      throw new ForbiddenException('Insufficient organisation permissions');
    }
    const project = await this.repo.save(new Project(dto.name, selectedOrganisation.organisation));
    return project.transformForResponse();
  }

}
