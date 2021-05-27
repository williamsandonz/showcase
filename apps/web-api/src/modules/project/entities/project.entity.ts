import { IProject } from '@monorepo/web-api-client';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organisation } from '../../organisation/entities';

@Entity()
export class Project {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Organisation, { nullable: false })
  organisation: Organisation;

  constructor(name: string, organisation: Organisation) {
    this.name = name;
    this.organisation = organisation;
  }

  transformForResponse(): IProject {
    return {
      name: this.name
    }
  }

}
