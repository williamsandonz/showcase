import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProductNodeComponent } from './components/product-node/product-node.component';
import { ProductRoutingModule } from './product-routing.module';
import { RootProductComponent } from './components/root/root.component';
import { GuestModule } from '../guest/guest.module';
import { ProductComponent } from './pages/product/product.component';
import { ProductService } from './providers/product.service';
import { GettingStartedComponent } from './components/getting-started/getting-started.component';
import { FAQsComponent } from './components/faqs/faqs.component';
import { ProductDotNetComponent } from './components/product-dot-net/product-dot-net.component';

@NgModule({
  declarations: [
    FAQsComponent,
    GettingStartedComponent,
    ProductComponent,
    ProductDotNetComponent,
    ProductNodeComponent,
    RootProductComponent,
  ],
  entryComponents: [],
  exports: [
  ],
  imports: [
    CommonModule,
    GuestModule,
    ProductRoutingModule,
    SharedModule
  ],
  providers: [
    ProductService
  ],
})
export class ProductNodeModule {}
