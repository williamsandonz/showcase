import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../../account/entities';
import { ProjectMembership, ProjectPermission } from '../entities';

@Injectable()
export class ProjectMembershipService {

  constructor(
    @InjectRepository(ProjectMembership)
    private membershipRepo: Repository<ProjectMembership>,
    @InjectRepository(ProjectPermission)
    private permissionRepo: Repository<ProjectPermission>,
  ) {}

  async getPermissions(): Promise<ProjectPermission[]> {
    return this.permissionRepo.find();
  }

  async getMemberships(accountId: string): Promise<ProjectMembership[]> {
    return this.membershipRepo.find({
      where: {
        account: accountId,
      }
    });
  }

}
