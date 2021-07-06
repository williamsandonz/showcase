import { IConfirmPaymentIntentRequestDto } from '@monorepo/web-api-client';

export class ConfirmPaymentIntentRequestDto implements IConfirmPaymentIntentRequestDto {
  paymentIntentId: string;
}
