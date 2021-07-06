import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organisation } from './organisation.entity';
import { v4 as uuidv4 } from 'uuid';
import { Account } from '../../account/entities';
import { IOrganisationInvitationVm } from '@monorepo/web-api-client';
import { addDays, differenceInCalendarDays } from 'date-fns';

export const invitationExpiryInDays = 14;

@Entity()
export class OrganisationInvitation {

  @Column({
    default: false
  })
  accepted: boolean;

  @Column()
  email: string;

  @Column({
    nullable: true
  })
  dateAccepted: Date;

  @Column()
  dateInvited: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, { nullable: false, eager: true })
  inviter: Account;

  @Column()
  secret: string;

  @ManyToOne(() => Organisation, {
    eager: true,
    nullable: false
  })
  organisation: Organisation;

  constructor(
    inviter: Account,
    email: string,
    organisation: Organisation
  ) {
    this.inviter = inviter;
    this.dateInvited = new Date();
    this.email = email;
    this.organisation = organisation;
    this.secret = uuidv4();
  }

  getExpiresInDays() {
    return differenceInCalendarDays(addDays(this.dateInvited, invitationExpiryInDays), new Date());
  }

  mapToViewModel(includeSecret = false) : IOrganisationInvitationVm {
    const response = {
      dateInvited: this.dateInvited.toString(),
      email: this.email,
      expiresInDays: this.getExpiresInDays(),
      id: this.id,
      inviter: this.inviter.mapToViewModel(),
      organisation: this.organisation.mapToViewModel(),
    }
    if(!includeSecret) {
      return response;
    }
    return {
      ...response,
      secret: this.secret
    }
  }

}
