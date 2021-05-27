import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CognitoUser } from '@aws-amplify/auth';
import { first } from 'rxjs/operators';
import { CognitoService } from './../../shared/providers/cognito.service';

@Injectable()
export class HomeGuestCanActivateGuard implements CanActivate {
  constructor(public cognitoService: CognitoService, public router: Router) {}

  async canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.cognitoService.authenticatedUser$.pipe(first()).subscribe((user: CognitoUser) => {
        if (user) {
          return this.router.navigate(['/members/projects']);
        }
        resolve(true);
      });
    });
  }
}
