import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductDotNetComponent } from './components/product-dot-net/product-dot-net.component';
import { ProductNodeComponent } from './components/product-node/product-node.component';
import { ProductComponent } from './pages/product/product.component';

const routes: Routes = [
  {
    children: [
      {
        component: ProductDotNetComponent,
        path: 'dot-net',
      },
      {
        component: ProductNodeComponent,
        path: 'node',
      },
    ],
    component: ProductComponent,
    path: 'for',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
