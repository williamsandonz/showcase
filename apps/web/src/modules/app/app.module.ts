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
  ],
  bootstrap: [RootComponent],
})
export class AppModule {}
