import { NgModule } from '@angular/core';
import { FormModule } from '../form/form.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { OrganisationRoutingModule } from './organisation-routing.module';
import { RootOrganisationComponent } from './components/root/root.component';
import { OrganisationSettingsComponent } from './pages/organisation-settings/organisation-settings.component';
import { OrganisationSettingsGeneralComponent } from './components/organisation-settings-general/organisation-settings-general.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { OrganisationSettingsMembersComponent } from './components/organisation-settings-members/organisation-settings-members.component';
import { OrganisationSettingsSubscriptionComponent } from './components/organisation-settings-subscription/organisation-settings-subscription.component';
import { OrganisationSettingsIntegrationsComponent } from './components/organisation-settings-integrations/organisation-settings-integrations.component';
import { MemberModule } from '../member/member.module';
import { EditOrganisationDetailsComponent } from './components/edit-organisation-details/edit-organisation-details.component';
import { InviteOrganisationMemberComponent } from './components/invite-organisation-member/invite-organisation-member.component';
import { OrganisationMembersComponent } from './components/organisation-members/organisation-members.component';
import { OrganisationInvitationsComponent } from './components/organisation-invitations/organisation-invitations.component';
import { ResendInvitationComponent } from './components/resend-invitation/resend-invitation.component';

@NgModule({
  declarations: [
    CreateProjectComponent,
    EditOrganisationDetailsComponent,
    InviteOrganisationMemberComponent,
    OrganisationInvitationsComponent,
    OrganisationMembersComponent,
    OrganisationSettingsComponent,
    OrganisationSettingsGeneralComponent,
    OrganisationSettingsIntegrationsComponent,
    OrganisationSettingsMembersComponent,
    OrganisationSettingsSubscriptionComponent,
    ProjectsComponent,
    ResendInvitationComponent,
    RootOrganisationComponent,
  ],
  entryComponents: [InviteOrganisationMemberComponent],
  exports: [
  ],
  imports: [CommonModule, FormModule, OrganisationRoutingModule, MemberModule, SharedModule],
  providers: [],
})
export class OrganisationModule {}
