import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Account {

  @Column({
    nullable: true,
  })
  cookieUsageEnabled: boolean;

  @PrimaryColumn()
  id: string;

  @Column()
  dateJoined: Date;

  @Column()
  lastLoggedIn: Date;

  @Column()
  name: string;

  @Column()
  stripeCustomerId: string;

}
