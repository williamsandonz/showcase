import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Demo } from './../../demo/entities/demo.entity';
import { Repository } from 'typeorm';
import { OrganisationPermission } from '../../organisation/entities';
import { OrganisationPermissionType, ProjectPermissionType } from '@monorepo/web-api-client';
import { ProjectPermission } from '../../project/entities';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Demo)
    private demoRepo: Repository<Demo>,
    @InjectRepository(OrganisationPermission)
    private organisationPermissionRepo: Repository<OrganisationPermission>,
    @InjectRepository(ProjectPermission)
    private projectPermissionRepo: Repository<ProjectPermission>,
  ) {}

  async createData() {
    await this.demoRepo.insert({
      foo: 'bar',
    });
    await this.organisationPermissionRepo.insert({
      description: 'TODOS',
      title: 'SUPER_USER',
      type: OrganisationPermissionType.SUPER_USER
    });
    await this.projectPermissionRepo.insert({
      description: 'TODOS',
      title: 'SUPER_USER',
      type: ProjectPermissionType.SUPER_USER
    });
  }

  async deleteData() {
    await this.demoRepo.remove(await this.demoRepo.find());
    await this.organisationPermissionRepo.remove(await this.organisationPermissionRepo.find());
    await this.projectPermissionRepo.remove(await this.projectPermissionRepo.find());
  }


}
