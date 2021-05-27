import { NgModule } from '@angular/core';
import { PaymentRoutingModule } from './payment-routing.module';
import { PurchaseComponent } from './pages/purchase/purchase.component';
import { StripeService } from './providers/stripe.service';
import { FormModule } from '../form/form.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { StripeCardComponent } from './components/stripe-card/stripe-card.component';

@NgModule({
  declarations: [PurchaseComponent, StripeCardComponent],
  imports: [CommonModule, FormModule, PaymentRoutingModule, SharedModule],
  providers: [StripeService],
})
export class PaymentModule {}
