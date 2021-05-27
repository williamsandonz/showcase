export interface IConfirmPaymentIntentRequestDto {
  paymentIntentId: string;
}

export interface ICreatePaymentIntentRequestDto {
  paymentMethodId: string;
  saveCard: boolean;
}

export interface IPaymentIntentResponseDto {
  intentClientSecret?: string;
  errorMessage?: string;
  paymentIntentId?: string;
  requiresAction?: boolean;
}
