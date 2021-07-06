import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeGuestComponent } from './pages/home-guest/home-guest.component';
import { HomeGuestCanActivateGuard } from './providers/home-guest-can-activate.guard';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { OAuthLoginCallbackComponent } from './pages/oauth-login-callback/oauth-login-callback.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AcceptInvitationComponent } from './pages/accept-invitation/accept-invitation.component';

const routes: Routes = [
  {
    canActivate: [HomeGuestCanActivateGuard],
    path: '',
    component: HomeGuestComponent,
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'accept-invitation',
    component: AcceptInvitationComponent,
  },
  {
    path: 'contact',
    component: ContactUsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'oauth-login',
    component: OAuthLoginCallbackComponent,
  },
  {
    path: 'pricing',
    component: PricingComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'terms-of-service',
    component: TermsOfServiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestRoutingModule {}
