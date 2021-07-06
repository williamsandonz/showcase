import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Project } from './../entities';
import { ICreateProjectRequestDto, IProjectMembershipVm, OrganisationPermissionType, ProjectPermissionType } from '@monorepo/web-api-client';
import { OrganisationMembershipService } from '../../organisation/providers';
import { ProjectMembershipService } from './project-membership.service';
import { DatabaseService, UtilityService } from '../../common/providers';
import { ProjectEditDetailsRequestDto } from '../dto/edit-details.dto';

@Injectable()
export class ProjectService {
  constructor(
    private databaseService: DatabaseService,
    private organisationMembershipService: OrganisationMembershipService,
    private membershipService: ProjectMembershipService,
    private utilityService: UtilityService
  ) {}

  async create(accountId: string, dto: ICreateProjectRequestDto): Promise<IProjectMembershipVm> {
    const selectedOrganisation = (await this.organisationMembershipService.getMemberships(accountId))
      .find(m => m.selected);
    if(!selectedOrganisation.permissions.some(p => p.type === OrganisationPermissionType.ADMIN)) {
      throw new ForbiddenException();
    }
    const project = await this.databaseService.getRepository(Project).save(new Project(dto.name, this.utilityService.urlify(dto.name), selectedOrganisation.organisation));
    const permissions = (await this.membershipService.getPermissions()).filter(
      permission => permission.type === ProjectPermissionType.ADMIN
    );
    const membership = await this.membershipService.createMembership(accountId, permissions, project);
    return membership.mapToViewModel();
  }

  async delete(id: number): Promise<any> {
    const queryRunner = await this.databaseService.startTransaction();
    try {
        await this.membershipService.deleteMembershipsForProject(id);
        await this.databaseService.getRepository(Project).delete(id);
      } catch(e) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(e);
      } finally {
        await this.databaseService.releaseTransaction();
      }
  }

  async editDetails(accountId: string, dto: ProjectEditDetailsRequestDto): Promise<void> {
    const repo = this.databaseService.getRepository(Project);
    const membership = (await this.membershipService
      .getMembershipsForAccount(accountId))
      .find(m => m.project.id === dto.id);
    if(!membership.permissions.some(p => p.type === ProjectPermissionType.ADMIN)) {
      throw new ForbiddenException();
    }
    const project = await repo.findOne(membership.project.id);
    project.name = dto.name;
    project.slug = dto.slug;
    await repo.save(project);
  }

}
