import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateOrganisationComponent } from './pages/create-organisation/create-organisation.component';
import { SupportComponent } from './pages/support/support.component';

const routes: Routes = [
  {
    component: CreateOrganisationComponent,
    path: 'create-organisation',
  },
  {
    path: 'support',
    component: SupportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberRoutingModule {}
