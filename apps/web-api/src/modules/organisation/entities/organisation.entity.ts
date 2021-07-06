import { IOrganisationVm } from '@monorepo/web-api-client';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organisation {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  constructor(
    name: string,
    slug: string
  ) {
    this.name = name;
    this.slug = slug;
  }

  mapToViewModel(): IOrganisationVm {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug
    }
  }

}
