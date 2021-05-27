import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootMemberComponent } from '../member/components/root/root.component';
import { RootGuestComponent } from '../guest/components/root/root.component';
import { AuthenticatedGuard } from '../shared/providers';

const routes: Routes = [
  {
    component: RootGuestComponent,
    path: '',
    loadChildren: () => import('./../guest/guest.module').then((m) => m.GuestModule),
  },
  {
    path: 'api',
    loadChildren: () => import('./../api/api.module').then((m) => m.ApiModule),
  },
  {
    canActivate: [AuthenticatedGuard],
    component: RootMemberComponent,
    path: 'members',
    loadChildren: () => import('./../member/member.module').then((m) => m.MemberModule),
  },
  {
    path: 'payments',
    loadChildren: () => import('./../payment/payment.module').then((m) => m.PaymentModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
