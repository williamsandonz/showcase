import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlatformDotNetComponent } from './pages/platform-dot-net/platform-dot-net.component';
import { PlatformNodeComponent } from './pages/platform-node/platform-node.component';
import { PlatformComponent } from './pages/platform/platform.component';
import { PlatformsComponent } from './pages/platforms/platforms.component';

const routes: Routes = [
  {
    component: PlatformsComponent,
    path: 'platforms',
  },
  {
    children: [
      {
        component: PlatformDotNetComponent,
        path: 'dot-net',
      },
      {
        component: PlatformNodeComponent,
        path: 'node',
      },
    ],
    component: PlatformComponent,
    path: 'platform',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentationRoutingModule {}
