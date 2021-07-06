import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './pages/projects/projects.component';
import { OrganisationSettingsGeneralComponent } from './components/organisation-settings-general/organisation-settings-general.component';
import { OrganisationSettingsIntegrationsComponent } from './components/organisation-settings-integrations/organisation-settings-integrations.component';
import { OrganisationSettingsMembersComponent } from './components/organisation-settings-members/organisation-settings-members.component';
import { OrganisationSettingsSubscriptionComponent } from './components/organisation-settings-subscription/organisation-settings-subscription.component';
import { OrganisationSettingsComponent } from './pages/organisation-settings/organisation-settings.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';

const routes: Routes = [
  {
    component: CreateProjectComponent,
    path: 'create-project',
  },
  {
    component: ProjectsComponent,
    path: 'projects',
  },
  {
    children: [
      {
        component: OrganisationSettingsGeneralComponent,
        path: 'general',
      },
      {
        component: OrganisationSettingsIntegrationsComponent,
        path: 'integrations',
      },
      {
        component: OrganisationSettingsMembersComponent,
        path: 'members',
      },
      {
        component: OrganisationSettingsSubscriptionComponent,
        path: 'subscriptions',
      },
    ],
    component: OrganisationSettingsComponent,
    path: 'settings',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganisationRoutingModule {}
