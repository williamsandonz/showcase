import { Injectable } from '@nestjs/common';
import { config } from './../../../config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(config.stripe.secret, {
      apiVersion: '2020-08-27',
      typescript: true,
    });
  }

  async createCustomer(): Promise<Stripe.Response<Stripe.Customer>> {
    const params: Stripe.CustomerCreateParams = {};
    return this.stripe.customers.create(params);
  }

  async retrieveCustomer(customerId: string): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    return this.stripe.customers.retrieve(customerId);
  }

  async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.confirm(paymentIntentId);
  }

  async createPaymentIntent(
    customerId: string,
    params: Stripe.PaymentIntentCreateParams
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const customer = await this.retrieveCustomer(customerId);
    return this.stripe.paymentIntents.create({
      ...params,
      customer: customer.id,
    });
  }
}
