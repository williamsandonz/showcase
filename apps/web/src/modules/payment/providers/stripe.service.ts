import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ReplaySubject } from 'rxjs';
import { environment } from './../../../environments/environment';

@Injectable()
export class StripeService {
  loaded = new ReplaySubject<boolean>(1);
  stripe: Stripe;

  constructor() {
    loadStripe(environment.stripe.publishableKey)
      .then((stripe: Stripe) => {
        this.stripe = stripe;
        this.loaded.next(true);
      })
      .catch((e) => {
        this.loaded.next(false);
      });
  }
}
