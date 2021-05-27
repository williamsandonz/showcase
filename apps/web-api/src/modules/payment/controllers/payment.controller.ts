import { Body, Controller, Post } from '@nestjs/common';
import { CognitoClaims } from '../../common/decorators';
import { PaymentService } from './../providers';
import { IPaymentIntentResponseDto } from '@monorepo/web-api-client';
import { CreatePaymentIntentRequestDto } from '../dto/create-payment-intent-request-dto';
import { ConfirmPaymentIntentRequestDto } from '../dto/confirm-payment-intent-request-dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post('create-intent')
  async onCreateIntent(
    @Body() dto: CreatePaymentIntentRequestDto,
    @CognitoClaims() cognitoClaims
  ): Promise<IPaymentIntentResponseDto> {
    return this.service.createIntent(dto, cognitoClaims.sub);
  }

  @Post('confirm-intent')
  async onConfirmIntent(@Body() dto: ConfirmPaymentIntentRequestDto): Promise<IPaymentIntentResponseDto> {
    return this.service.confirmIntent(dto);
  }
}
