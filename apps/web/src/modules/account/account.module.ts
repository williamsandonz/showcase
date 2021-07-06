import { NgModule } from '@angular/core';
import { FormModule } from '../form/form.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { OAuthLogoutCallbackComponent } from './pages/oauth-logout-callback/oauth-logout-callback.component';
import { AccountSettingsGeneralComponent } from './components/account-settings-general/account-settings-general.component';
import { AccountSettingsSecurityComponent } from './components/account-settings-security/account-settings-security.component';
import { AccountSettingsSubscriptionsComponent } from './components/account-settings-subscriptions/account-settings-subscriptions.component';
import { AccountRoutingModule } from './account.routing.module';
import { RootAccountComponent } from './components/root/root.component';
import { MemberModule } from '../member/member.module';
import { EditAccountDetailsComponent } from './components/edit-account-details/edit-account-details.component';
import { AccountSettingsNotificationsComponent } from './components/account-settings-notifications/account-settings-notifications.component';

@NgModule({
  declarations: [
    AccountSettingsComponent,
    AccountSettingsGeneralComponent,
    AccountSettingsNotificationsComponent,
    AccountSettingsSecurityComponent,
    AccountSettingsSubscriptionsComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    DeleteAccountComponent,
    EditAccountDetailsComponent,
    OAuthLogoutCallbackComponent,
    RootAccountComponent,
    VerifyEmailComponent,
  ],
  entryComponents: [ChangePasswordComponent],
  imports: [AccountRoutingModule, CommonModule, FormModule, MemberModule, SharedModule],
  providers: [],
})
export class AccountModule {}
