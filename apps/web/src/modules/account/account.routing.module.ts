import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { AccountSettingsGeneralComponent } from './components/account-settings-general/account-settings-general.component';
import { AccountSettingsSecurityComponent } from './components/account-settings-security/account-settings-security.component';
import { OAuthLogoutCallbackComponent } from './pages/oauth-logout-callback/oauth-logout-callback.component';
import { AccountSettingsNotificationsComponent } from './components/account-settings-notifications/account-settings-notifications.component';

const routes: Routes = [
  {
    component: OAuthLogoutCallbackComponent,
    path: 'oauth-logout',
  },
  {
    children: [
      {
        component: AccountSettingsGeneralComponent,
        path: 'general',
      },
      {
        component: AccountSettingsNotificationsComponent,
        path: 'notifications',
      },
      {
        component: AccountSettingsSecurityComponent,
        path: 'security',
      }//,
      //{
      //  component: AccountSettingsSubscriptionsComponent,
      //  path: 'subscriptions',
      //},
    ],
    component: AccountSettingsComponent,
    path: 'settings',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
