import { Component, OnInit } from '@angular/core';
import { CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { CognitoService } from './../../../shared/providers';
@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent implements OnInit {
  processing = false;

  constructor(public cognitoService: CognitoService) {}

  ngOnInit() {}

  async onClick() {
    await this.cognitoService.federatedSignIn(CognitoHostedUIIdentityProvider.Google);
  }
}
