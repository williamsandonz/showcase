import { Injectable } from '@nestjs/common';
import { OrganisationPermissionType, ProjectPermissionType } from '@monorepo/web-api-client';
import { DatabaseService } from '../../common/providers';
import { Demo } from '../../demo/entities';
import { OrganisationPermission } from '../../organisation/entities';
import { ProjectPermission } from '../../project/entities';

@Injectable()
export class SeedService {
  constructor(
    private databaseService: DatabaseService
  ) {}

  async createData() {
    await this.databaseService.getRepository(Demo).insert({
      foo: 'bar',
    });
    await this.databaseService.getRepository(OrganisationPermission).insert({
      description: 'TODO',
      title: 'ADMIN',
      type: OrganisationPermissionType.ADMIN
    });
    await this.databaseService.getRepository(OrganisationPermission).insert({
      description: 'TODO',
      title: 'USER',
      type: OrganisationPermissionType.USER
    });
    await this.databaseService.getRepository(ProjectPermission).insert({
      description: 'TODO',
      title: 'ADMIN',
      type: ProjectPermissionType.ADMIN
    });
    await this.databaseService.getRepository(ProjectPermission).insert({
      description: 'TODO',
      title: 'USER',
      type: ProjectPermissionType.USER
    });
  }

  async deleteData() {
    const demoRepo = this.databaseService.getRepository(Demo);
    await demoRepo.remove(await demoRepo.find());
    const orgPermissionRepo = this.databaseService.getRepository(OrganisationPermission);
    await orgPermissionRepo.remove(await orgPermissionRepo.find());
    const projectPermissionRepo = this.databaseService.getRepository(ProjectPermission);
    await projectPermissionRepo.remove(await projectPermissionRepo.find());
  }


}
