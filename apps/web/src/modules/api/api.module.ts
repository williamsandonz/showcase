import { NgModule } from '@angular/core';
import { SdkApiService } from './providers/sdk-api.service';
import { FormModule } from '../form/form.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApiRoutingModule } from './api-routing.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, FormModule, ApiRoutingModule, SharedModule],
  providers: [SdkApiService],
})
export class ApiModule {}
