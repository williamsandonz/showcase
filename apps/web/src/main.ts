import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as Sentry from '@sentry/angular';
import { AppModule } from './modules/app/app.module';
import { environment } from './environments/environment';

if (environment.exceptions.sentryDsn) {
  Sentry.init({
    dsn: environment.exceptions.sentryDsn,
    environment: environment.system.environment,
    release: environment.system.release,
  });
}

if (environment.enableProdMode) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
