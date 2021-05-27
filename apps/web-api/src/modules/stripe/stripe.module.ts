import { Module } from '@nestjs/common';
import { StripeService } from './providers';

@Module({
  exports: [StripeService],
  imports: [],
  providers: [StripeService],
})
export class StripeModule {}
