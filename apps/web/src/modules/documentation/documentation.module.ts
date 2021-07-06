import { NgModule } from '@angular/core';
import { FormModule } from '../form/form.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DocumentationRoutingModule } from './documentation-routing.module';
import { PlatformsComponent } from './pages/platforms/platforms.component';
import { GuestModule } from '../guest/guest.module';
import { RootDocumentationComponent } from './components/root/root.component';
import { PlatformNavigationComponent } from './components/platform-navigation/platform-navigation.component';
import { PlatformNodeComponent } from './pages/platform-node/platform-node.component';
import { PlatformDotNetComponent } from './pages/platform-dot-net/platform-dot-net.component';
import { PlatformComponent } from './pages/platform/platform.component';
import { PlatformDocsService } from './providers/platform-docs.service';

@NgModule({
  declarations: [
    PlatformNavigationComponent,
    PlatformComponent,
    PlatformsComponent,
    PlatformDotNetComponent,
    PlatformNodeComponent,
    RootDocumentationComponent,
  ],
  entryComponents: [],
  exports: [
  ],
  imports: [CommonModule, DocumentationRoutingModule, FormModule, GuestModule, SharedModule],
  providers: [
    PlatformDocsService,
  ],
})
export class DocumentationModule {}
