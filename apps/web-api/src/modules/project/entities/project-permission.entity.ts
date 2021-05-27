import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectPermissionType, IProjectPermission } from '@monorepo/web-api-client';

@Entity()
export class ProjectPermission {

  @Column()
  description: string;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    enum: ProjectPermissionType,
    type: 'enum',
  })
  type: ProjectPermissionType;

  transformForResponse(): IProjectPermission {
    return {
      description: this.description,
      id: this.id,
      title: this.title,
      type: this.type,
    }
  }

}
