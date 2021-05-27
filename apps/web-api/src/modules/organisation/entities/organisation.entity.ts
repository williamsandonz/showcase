import { IOrganisation } from '@monorepo/web-api-client';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organisation {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  transformForResponse(): IOrganisation {
    return {
      id: this.id,
      name: this.name,
    }
  }


}
