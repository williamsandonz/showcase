import { Injectable } from '@nestjs/common';
import { Account } from './../entities';
import { StripeService } from '../../stripe/providers';
import { DatabaseService } from '../../common/providers';

@Injectable()
export class AccountService {
  constructor(
    private databaseService: DatabaseService,
    private stripeService: StripeService
  ) {}

  async create(
    email: string,
    id: string,
    name: string,
    timezone: string,
  ): Promise<Account> {
    const repo = this.databaseService.getRepository(Account);

    // Deliberately creating customer before saving account so that worst case
    // we have an unassociated customer rather than an account without a customer.
    const stripeCustomer = await this.stripeService.createCustomer();
    const timestamp = new Date();

    return repo.save({
      id: id,
      dateJoined: timestamp,
      email: email,
      lastLoggedIn: timestamp,
      name: name,
      stripeCustomerId: stripeCustomer.id,
      timezone: timezone,
    } as Account);
  }

  async delete(id: string): Promise<any> {
    return this.databaseService.getRepository(Account).delete(id);
  }

  async findById(id: string) {
    return this.databaseService.getRepository(Account).findOne(id);
  }

  async findByEmail(email: string) {
    return this.databaseService.getRepository(Account).findOne({
      where: {
        email
      }
    });
  }

  async save(account: Account) {
    return this.databaseService.getRepository(Account).save(account);
  }

}
