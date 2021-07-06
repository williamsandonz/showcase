import { NgModule, ModuleWithProviders } from '@angular/core';
import { UiModule } from '../ui/ui.module';
import { AsyncButtonComponent } from './components/async-button/async-button.component';
import { HeadingPanelComponent } from './components/heading-panel/heading-panel.component';
import { CognitoService, StorageService, AuthenticatedGuard, SentryService, UserService } from './providers';
import { UtilityService } from './providers';
import { CommonModule } from '@angular/common';
import { RoutingService } from './providers/routing.service';
import { VimeoVideoComponent } from './components/vimeo-video/vimeo-video.component';
import { CodeComponent } from './components/code/code.component';
import { HighlightModule } from 'ngx-highlightjs';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ProductMenuComponent } from './components/product-menu/product-menu.component';

const declarations = [
  AsyncButtonComponent,
  CodeComponent,
  FooterComponent,
  HeaderComponent,
  HeadingPanelComponent,
  ProductMenuComponent,
  VimeoVideoComponent,
];

@NgModule({
  imports: [CommonModule, HighlightModule, RouterModule, UiModule],
  declarations: [
    ...declarations,
  ],
  exports: [
    ...declarations,
    UiModule
  ],
  providers: [],
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [AuthenticatedGuard, CognitoService, RoutingService, SentryService, StorageService, UserService, UtilityService],
    };
  }
}
