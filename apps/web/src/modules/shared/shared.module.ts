import { NgModule, ModuleWithProviders } from '@angular/core';
import { UiModule } from '../ui/ui.module';
import { AsyncButtonComponent } from './components/async-button/async-button.component';
import { HeadingPanelComponent } from './components/heading-panel/heading-panel.component';
import { CognitoService, StorageService, AuthenticatedGuard, SentryService, AccountService } from './providers';
import { UtilityService } from './providers';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [AsyncButtonComponent, HeadingPanelComponent],
  exports: [AsyncButtonComponent, HeadingPanelComponent, UiModule],
  providers: [],
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [AccountService, AuthenticatedGuard, CognitoService, SentryService, StorageService, UtilityService],
    };
  }
}
