import { NgModule } from '@angular/core';
import { FormModule } from '../form/form.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ProjectRoutingModule } from './project-routing.module';
import { RootProjectComponent } from './components/root/root.component';
import { MemberModule } from '../member/member.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SdkApiService } from './providers/sdk-api.service';
import { ProjectSettingsComponent } from './pages/project-settings/project-settings.component';
import { EditProjectDetailsComponent } from './components/edit-project-details/edit-project-details.component';
import { ProjectSettingsGeneralComponent } from './components/project-settings-general/project-settings-general.component';
import { DeleteProjectComponent } from './components/delete-project/delete-project.component';
import { ProjectSettingsSdkComponent } from './components/project-settings-sdk/project-settings-sdk.component';
import { ProjectSettingsMembersComponent } from './components/project-settings-members/project-settings-members.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DeleteProjectComponent,
    EditProjectDetailsComponent,
    ProjectSettingsComponent,
    ProjectSettingsGeneralComponent,
    ProjectSettingsMembersComponent,
    ProjectSettingsSdkComponent,
    RootProjectComponent
  ],
  entryComponents: [
    DeleteProjectComponent
  ],
  exports: [
  ],
  imports: [CommonModule, FormModule, MemberModule, ProjectRoutingModule, SharedModule],
  providers: [SdkApiService],
})
export class ProjectModule {}
