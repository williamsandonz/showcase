import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IOrganisationPermission, OrganisationPermissionType } from '@monorepo/web-api-client';

@Entity()
export class OrganisationPermission {

  @Column()
  description: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    enum: OrganisationPermissionType,
    type: 'enum',
  })
  type: OrganisationPermissionType;

  transformForResponse(): IOrganisationPermission {
    return {
      description: this.description,
      id: this.id,
      title: this.title,
      type: this.type,
    }
  }

}
