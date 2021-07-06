import { ErrorHandler, NgModule } from '@angular/core';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { AppRoutingModule } from './app-routing.module';
import { RootComponent } from './components/root/root.component';
import { SharedModule } from '../shared/shared.module';
import { FormModule } from './../form/form.module';
import { CookieDisclaimerComponent } from './components/cookie-disclaimer/cookie-disclaimer.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppErrorHandler, ApiHttpInterceptor } from './providers';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GuestModule } from '../guest/guest.module';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

const analyticsModules = environment.analyticsTrackingCode ?
  [
    NgxGoogleAnalyticsModule.forRoot(environment.analyticsTrackingCode),
    NgxGoogleAnalyticsRouterModule,
  ] : [];

@NgModule({
  imports: [
    ...analyticsModules,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormModule,
    GuestModule,
    // NB: Must only be included here otherwise lazy loaded modules will not get the interceptors
    HttpClientModule,
    SharedModule.forRoot(),
  ],
  declarations: [
    RootComponent,
    CookieDisclaimerComponent,
  ],
  entryComponents: [],
  providers: [
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHttpInterceptor,
      multi: true,
    },
    {
      // Should be provided in Documentation module but plugin does not support
      // https://github.com/MurhafSousli/ngx-highlightjs/issues/137
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'), // Optional, only if you want the line numbers
        languages: {
          typescript: () => import('highlight.js/lib/languages/typescript'),
        }
      }
    }
  ],
  bootstrap: [RootComponent],
})
export class AppModule {}
