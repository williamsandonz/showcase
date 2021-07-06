import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectSettingsGeneralComponent } from './components/project-settings-general/project-settings-general.component';
import { ProjectSettingsMembersComponent } from './components/project-settings-members/project-settings-members.component';
import { ProjectSettingsSdkComponent } from './components/project-settings-sdk/project-settings-sdk.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectSettingsComponent } from './pages/project-settings/project-settings.component';

const routes: Routes = [
  {
    component: DashboardComponent,
    path: 'dashboard',
  },
  {
    children: [
      {
        component: ProjectSettingsGeneralComponent,
        path: 'general',
      },
      {
        component: ProjectSettingsMembersComponent,
        path: 'members',
      },
      {
        component: ProjectSettingsSdkComponent,
        path: 'sdk',
      },
    ],
    component: ProjectSettingsComponent,
    path: 'settings',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
