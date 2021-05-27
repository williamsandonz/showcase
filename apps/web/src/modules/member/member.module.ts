import { NgModule } from '@angular/core';
import { FormModule } from '../form/form.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { OAuthLogoutCallbackComponent } from './pages/oauth-logout-callback/oauth-logout-callback.component';
import { RootMemberComponent } from './components/root/root.component';
import { FooterMemberComponent } from './components/footer/footer.component';
import { HeaderMemberComponent } from './components/header/header.component';
import { OrganisationSettingsComponent } from './pages/organisation-settings/organisation-settings.component';
import { OrganisationSettingsGeneralComponent } from './components/organisation-settings-general/organisation-settings-general.component';
import { AccountSettingsDetailComponent } from './components/account-settings-details/account-settings-details.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { OrganisationSettingsMembersComponent } from './components/organisation-settings-members/organisation-settings-members.component';

@NgModule({
  declarations: [
    AccountSettingsComponent,
    AccountSettingsDetailComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    CreateProjectComponent,
    DeleteAccountComponent,
    EditAccountComponent,
    FooterMemberComponent,
    HeaderMemberComponent,
    OAuthLogoutCallbackComponent,
    OrganisationSettingsComponent,
    OrganisationSettingsGeneralComponent,
    OrganisationSettingsMembersComponent,
    ProjectsComponent,
    RootMemberComponent,
    VerifyEmailComponent,
  ],
  entryComponents: [ChangePasswordComponent],
  imports: [CommonModule, FormModule, MemberRoutingModule, SharedModule],
  providers: [],
})
export class MemberModule {}
