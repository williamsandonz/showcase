import { Injectable } from '@angular/core';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoService } from './cognito.service';
import * as Sentry from '@sentry/angular';

@Injectable()
export class SentryService {
  authenticatedUser: CognitoUser;

  constructor(public cognitoService: CognitoService) {
    this.cognitoService.authenticatedUser$.subscribe((user) => (this.authenticatedUser = user));
  }

  capture(error: Error) {
    console.warn('Synthetic error captured by Sentry');
    console.warn(error);
    Sentry.withScope((scope) => {
      if (this.authenticatedUser) {
        scope.setUser({ id: this.authenticatedUser['attributes'].sub });
      }
      Sentry.captureException(error);
    });
  }
}
