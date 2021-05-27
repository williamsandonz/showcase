import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CognitoUser } from '@aws-amplify/auth';
import { first } from 'rxjs/operators';
import { CognitoService } from './cognito.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private cognitoService: CognitoService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    return new Promise((resolve) => {
      this.cognitoService.authenticatedUser$.pipe(first()).subscribe((user: CognitoUser) => {
        if(!!user) {
          resolve(true);
        } else {
          this.router.navigate(['/']);
        }
      });
    });
  }
}
