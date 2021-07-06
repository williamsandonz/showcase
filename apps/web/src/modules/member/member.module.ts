import { NgModule } from '@angular/core';
import { FormModule } from '../form/form.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { SupportComponent } from './pages/support/support.component';
import { RootMemberComponent } from './components/root/root.component';
import { CreateOrganisationComponent } from './pages/create-organisation/create-organisation.component';

@NgModule({
  declarations: [
    CreateOrganisationComponent,
    RootMemberComponent,
    SupportComponent,
  ],
  entryComponents: [],
  exports: [
  ],
  imports: [CommonModule, FormModule, MemberRoutingModule, SharedModule],
  providers: [],
})
export class MemberModule {}

