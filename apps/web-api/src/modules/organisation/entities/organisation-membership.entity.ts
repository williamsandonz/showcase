import { IOrganisationMembership } from '@monorepo/web-api-client';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../../account/entities';
import { OrganisationPermission } from './organisation-permission.entity';
import { Organisation } from './organisation.entity';

@Entity()
export class OrganisationMembership {

  @ManyToOne(() => Account, { nullable: false })
  account: Account;

  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Organisation, {
    eager: true,
    nullable: false
  })
  organisation: Organisation;

  @ManyToMany(() => OrganisationPermission, {
    eager: true
  })
  @JoinTable()
  permissions: OrganisationPermission[];

  @Column({
    default: false
  })
  selected: boolean;

  constructor(
    account: Account,
    organisation: Organisation,
    permissions: OrganisationPermission[],
    selected = false
  ) {
    this.account = account;
    this.organisation = organisation;
    this.permissions = permissions;
    this.selected = selected;
  }

  transformForResponse(): IOrganisationMembership {
    return {
      organisation: this.organisation.transformForResponse(),
      permissions: this.permissions.map(permission => permission.transformForResponse()),
      selected: this.selected
    };
  }

}
