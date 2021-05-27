import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IDemo } from '@monorepo/sdk-api-client';

@Entity()
export class Demo implements IDemo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  foo: string;
}
