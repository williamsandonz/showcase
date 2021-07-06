import { IProjectMemberListResponseDto } from '@monorepo/web-api-client';
import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';
import { DatabaseService } from '../../common/providers';
import { Project, ProjectMembership, ProjectPermission } from '../entities';

@Injectable()
export class ProjectMembershipService {

  constructor(
    private databaseService: DatabaseService,
  ) {}

  async deleteMembershipsForAccount(accountId: string): Promise<void> {
    const memberships = await this.getMembershipsForAccount(accountId);
    await this.delete(memberships);
  }

  async deleteMembershipsForProject(projectId: number): Promise<void> {
    const memberships = await this.getMembershipsForProject(projectId);
    await this.delete(memberships);
  }

  private async delete(memberships: ProjectMembership[]): Promise<void> {
    const permissions: ProjectPermission[] = [];
    permissions.concat(...memberships.map(m => m.permissions));
    await this.databaseService.getRepository(ProjectPermission).remove(permissions);
    await this.databaseService.getRepository(ProjectMembership).remove(memberships);
  }

  async getPermissions(): Promise<ProjectPermission[]> {
    return this.databaseService.getRepository(ProjectPermission).find();
  }

  async getMembershipsForAccount(accountId: string): Promise<ProjectMembership[]> {
    return this.databaseService.getRepository(ProjectMembership).find({
      where: {
        account: accountId,
      }
    });
  }

  async getMembershipsForProject(projectId: number): Promise<ProjectMembership[]> {
    return this.databaseService.getRepository(ProjectMembership).find({
      where: {
        project: projectId,
      }
    });
  }

  async getMembershipsForProjectPaginated(
    accountId: string,
    projectId: number,
    page: number,
    perPage: number
  ): Promise<IProjectMemberListResponseDto> {
    const repo = this.databaseService.getRepository(ProjectMembership);
    const members = await repo.findAndCount({
      relations: ['account'],
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        account: Not(accountId),
        project: projectId
      }
    });
    return {
      members: members[0].map(m => m.mapToViewModel()),
      total: members[1]
    }
  }

  async createMembership(
    accountId: string,
    permissions: ProjectPermission[],
    project: Project,
  ): Promise<ProjectMembership> {
    return this.databaseService.getRepository(ProjectMembership).save(new ProjectMembership(
      accountId,
      permissions,
      project,
    ));
  }

}
