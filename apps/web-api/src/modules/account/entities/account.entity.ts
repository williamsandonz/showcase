import { IAccountVm } from '@monorepo/web-api-client';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Account {

  @Column({
    nullable: true,
  })
  cookieUsageEnabled: boolean;

  @Column()
  dateJoined: Date;

  @Column()
  email: string;

  @PrimaryColumn()
  id: string;

  @Column()
  lastLoggedIn: Date;

  @Column()
  name: string;

  @Column()
  stripeCustomerId: string;

  @Column()
  timezone: string

  mapToViewModel(): IAccountVm {
    return {
      dateJoined: this.dateJoined,
      email: this.email,
      id: this.id,
      name: this.name
    }
  }

}
