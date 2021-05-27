import { IProjectMembership } from '@monorepo/web-api-client';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({
    default: false
  })
  selected: boolean;

  constructor(
    account: Account,
    project: Project,
    permissions: ProjectPermission[],
    selected = false
  ) {
    this.account = account;
    this.project = project;
    this.permissions = permissions;
    this.selected = selected;
  }

  transformForResponse(): IProjectMembership {
    return {
      project: this.project.transformForResponse(),
      permissions: this.permissions.map(permission => permission.transformForResponse()),
      selected: this.selected
    };
  }

}
