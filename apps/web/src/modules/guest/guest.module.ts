import { NgModule } from '@angular/core';
import { FormModule } from '../form/form.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { GuestRoutingModule } from './guest-routing.module';
import { HomeGuestComponent } from './pages/home-guest/home-guest.component';
import { HomeGuestCanActivateGuard } from './providers/home-guest-can-activate.guard';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { GoogleLoginComponent } from './components/google-login/google-login.component';
import { OAuthLoginCallbackComponent } from './pages/oauth-login-callback/oauth-login-callback.component';
import { RootGuestComponent } from './components/root/root.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AcceptInvitationComponent } from './pages/accept-invitation/accept-invitation.component';
@NgModule({
  declarations: [
    AboutUsComponent,
    AcceptInvitationComponent,
    ContactUsComponent,
    ForgotPasswordComponent,
    GoogleLoginComponent,
    HomeGuestComponent,
    LoginComponent,
    OAuthLoginCallbackComponent,
    PricingComponent,
    PrivacyPolicyComponent,
    ResetPasswordComponent,
    RootGuestComponent,
    SignUpComponent,
    TermsOfServiceComponent,
  ],
  entryComponents: [ForgotPasswordComponent],
  exports: [
  ],
  imports: [CommonModule, FormModule, GuestRoutingModule, SharedModule],
  providers: [
    HomeGuestCanActivateGuard
  ],
})
export class GuestModule {}
