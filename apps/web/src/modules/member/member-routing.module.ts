import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountSettingsComponent } from './pages/account-settings/account-settings.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { OAuthLogoutCallbackComponent } from './pages/oauth-logout-callback/oauth-logout-callback.component';
import { OrganisationSettingsGeneralComponent } from './components/organisation-settings-general/organisation-settings-general.component';
import { OrganisationSettingsComponent } from './pages/organisation-settings/organisation-settings.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';

const routes: Routes = [
  {
    component: CreateProjectComponent,
    path: 'create-project',
  },
  {
    component: OAuthLogoutCallbackComponent,
    path: 'oauth-logout',
  },
  {
    children: [
      {
        component: EditAccountComponent,
        path: 'details',
      },
    ],
    component: AccountSettingsComponent,
    path: 'settings/account',
  },
  {
    children: [
      {
        component: OrganisationSettingsGeneralComponent,
        path: 'general',
      },
    ],
    component: OrganisationSettingsComponent,
    path: 'settings/organisation',
  },
  {
    component: ProjectsComponent,
    path: 'projects',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberRoutingModule {}
