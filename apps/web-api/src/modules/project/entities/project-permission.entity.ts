import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectPermissionType, IProjectPermissionVm } from '@monorepo/web-api-client';

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

  mapToViewModel(): IProjectPermissionVm {
    return {
      description: this.description,
      id: this.id,
      title: this.title,
      type: this.type,
    }
  }

}
