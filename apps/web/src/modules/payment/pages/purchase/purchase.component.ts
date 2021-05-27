import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
  constants,
  IConfirmPaymentIntentRequestDto,
  ICreatePaymentIntentRequestDto,
  IPaymentIntentResponseDto,
} from '@monorepo/web-api-client';
import { IApiResponse } from '@monorepo/api-client';
import { PaymentIntentResult, PaymentMethodResult, StripeCardElement } from '@stripe/stripe-js';
import { SentryService } from '../../../shared/providers';
import { StripeService } from '../../providers/stripe.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit {
  card: StripeCardElement;
  errorMessage: string;
  failure: boolean;
  form: FormGroup;
  processing: boolean;
  purchaseComplete: boolean;
  submitted: boolean;

  constructor(
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public sentryService: SentryService,
    public stripeService: StripeService,
    public titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Purchase`);
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      card: [''],
      saveCard: [false],
    });
  }

  onStripeCardElementReady(card: StripeCardElement) {
    this.card = card;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.errorMessage = null;
    this.processing = true;

    const formValue = this.form.value;

    this.stripeService.stripe
      .createPaymentMethod({
        type: 'card',
        card: this.card,
        billing_details: {
          name: formValue.name,
        },
      })
      .then((result: PaymentMethodResult) => {
        if (result.error) {
          this.onDenied(result.error.message);
          return;
        }
        this.createPaymentIntent(result);
      })
      .catch((e: Error) => {
        this.onFailure(e);
      });
  }

  createPaymentIntent(paymentMethodResult: PaymentMethodResult) {
    this.httpClient
      .post('/payment/create-intent', {
        paymentMethodId: paymentMethodResult.paymentMethod.id,
        saveCard: this.form.value.saveCard,
      } as ICreatePaymentIntentRequestDto)
      .subscribe(
        (response: IApiResponse<IPaymentIntentResponseDto>) => {
          if (response.payload.errorMessage) {
            this.onDenied(response.payload.errorMessage);
            return;
          }
          const secret = response.payload.intentClientSecret;
          if (response.payload.requiresAction) {
            this.onActionRequired(secret);
            return;
          }
          this.onSuccess();
        },
        (response: HttpErrorResponse) => {
          this.onFailure(response.error);
        }
      );
  }

  confirmPaymentIntent(paymentIntentId: string) {
    this.httpClient
      .post('/payment/confirm-intent', {
        paymentIntentId,
      } as IConfirmPaymentIntentRequestDto)
      .subscribe(
        (response: IApiResponse<IPaymentIntentResponseDto>) => {
          if (response.error) {
            this.onDenied(response.payload.errorMessage);
            return;
          }
          this.onSuccess();
        },
        (response: HttpErrorResponse) => {
          this.onFailure(response.error);
        }
      );
  }

  onActionRequired(intentClientSecret: string) {
    this.stripeService.stripe
      .handleCardAction(intentClientSecret)
      .then((result: PaymentIntentResult) => {
        if (result.error) {
          this.onDenied(result.error.message);
          return;
        }
        if (result.paymentIntent.status === 'requires_confirmation') {
          this.confirmPaymentIntent(result.paymentIntent.id);
          return;
        }
        this.sentryService.capture(new Error('Unhandled payment intent status'));
      })
      .catch((error: Error) => {
        this.onFailure(error);
      });
  }

  onFailure(error: Error) {
    this.failure = true;
    this.sentryService.capture(error);
    this.processing = false;
  }

  onDenied(errorMessage: string) {
    this.errorMessage = errorMessage;
    this.processing = false;
  }

  onSuccess() {
    this.purchaseComplete = true;
    this.processing = false;
  }
}
