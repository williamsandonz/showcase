import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CognitoUser } from '@aws-amplify/auth';
import { first } from 'rxjs/operators';
import { RoutingService } from '../../shared/providers/routing.service';
import { CognitoService } from './../../shared/providers/cognito.service';

@Injectable()
export class HomeGuestCanActivateGuard implements CanActivate {
  constructor(public cognitoService: CognitoService, public router: Router, private routingService: RoutingService) {}

  async canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.cognitoService.authenticatedUser$.pipe(first()).subscribe(async (user: CognitoUser) => {
        if (user) {
         return this.routingService.goToOrganisationPage('projects');
        }
        resolve(true);
      });
    });
  }
}
