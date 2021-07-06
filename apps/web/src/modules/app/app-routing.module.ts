import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootGuestComponent } from '../guest/components/root/root.component';
import { AuthenticatedGuard } from '../shared/providers';
import { RootAccountComponent } from '../account/components/root/root.component';
import { RootOrganisationComponent } from '../organisation/components/root/root.component';
import { RootProjectComponent } from '../project/components/root/root.component';
import { RootDocumentationComponent } from '../documentation/components/root/root.component';
import { RootMemberComponent } from '../member/components/root/root.component';
import { RootProductComponent } from '../product/components/root/root.component';

const routes: Routes = [
  {
    component: RootGuestComponent,
    path: '',
    loadChildren: () => import('./../guest/guest.module').then((m) => m.GuestModule),
  },
  {
    canActivate: [AuthenticatedGuard],
    component: RootAccountComponent,
    path: 'account',
    loadChildren: () => import('./../account/account.module').then((m) => m.AccountModule),
  },
  {
    component: RootDocumentationComponent,
    path: 'docs',
    loadChildren: () => import('./../documentation/documentation.module').then((m) => m.DocumentationModule),
  },
  {
    canActivate: [AuthenticatedGuard],
    component: RootMemberComponent,
    path: 'members',
    loadChildren: () => import('./../member/member.module').then((m) => m.MemberModule),
  },
  {
    canActivate: [AuthenticatedGuard],
    component: RootOrganisationComponent,
    path: 'orgs/:organisationName',
    loadChildren: () => import('./../organisation/organisation.module').then((m) => m.OrganisationModule),
  },
  {
    path: 'payments',
    loadChildren: () => import('./../payment/payment.module').then((m) => m.PaymentModule),
  },
  {
    component: RootProductComponent,
    path: 'product',
    loadChildren: () => import('./../product/product.module').then((m) => m.ProductNodeModule),
  },
  {
    canActivate: [AuthenticatedGuard],
    component: RootProjectComponent,
    path: 'projects/:slug/:id',
    loadChildren: () => import('./../project/project.module').then((m) => m.ProjectModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64],
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
