import { IProjectVm } from '@monorepo/web-api-client';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organisation } from '../../organisation/entities';

@Entity()
export class Project {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @ManyToOne(() => Organisation, { nullable: false, eager: true })
  organisation: Organisation;

  constructor(name: string, slug: string, organisation: Organisation) {
    this.name = name;
    this.slug = slug;
    this.organisation = organisation;
  }

  mapToViewModel(): IProjectVm {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug
    }
  }

}
