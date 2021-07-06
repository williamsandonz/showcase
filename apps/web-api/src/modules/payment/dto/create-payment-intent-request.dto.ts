import { ICreatePaymentIntentRequestDto } from '@monorepo/web-api-client';
import { IsString } from 'class-validator';

export class CreatePaymentIntentRequestDto implements ICreatePaymentIntentRequestDto {
  @IsString()
  paymentMethodId: string;

  saveCard: boolean;
}
