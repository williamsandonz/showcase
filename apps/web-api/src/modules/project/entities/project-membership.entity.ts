import { IProjectMembershipVm } from '@monorepo/web-api-client';
import { Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../../account/entities';
import { ProjectPermission } from './project-permission.entity';
import { Project } from './project.entity';

@Entity()
export class ProjectMembership {

  @ManyToOne(() => Account, { nullable: false })
  account: Account;

  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Project, {
    eager: true,
    nullable: false
  })
  project: Project;

  @ManyToMany(() => ProjectPermission, {
    eager: true
  })
  @JoinTable()
  permissions: ProjectPermission[];

  constructor(
    accountId: string,
    permissions: ProjectPermission[],
    project: Project,
  ) {
    if(accountId) {
      this.account = {
        id: accountId
      } as any;
    }
    this.permissions = permissions;
    this.project = project;
  }

  mapToViewModel(): IProjectMembershipVm {
    return {
      account: this.account instanceof Account ? this.account.mapToViewModel() : null,
      project: this.project.mapToViewModel(),
      permissions: this.permissions.map(permission => permission.mapToViewModel()),
    };
  }

}
