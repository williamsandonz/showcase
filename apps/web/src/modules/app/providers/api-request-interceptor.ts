import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { CognitoService } from './../../shared/providers';
import { CognitoUser } from '@aws-amplify/auth';

@Injectable()
export class ApiHttpInterceptor implements HttpInterceptor {
  authenticatedUser: CognitoUser;

  constructor(public cognitoService: CognitoService, public router: Router) {
    this.cognitoService.authenticatedUser$.subscribe((user) => (this.authenticatedUser = user));
  }

  private async getHeaders() {
    const headers: any = {};
    if (this.authenticatedUser) {
      headers.Authorization = `Bearer ${this.authenticatedUser.getSignInUserSession().getAccessToken().getJwtToken()}`;
    }
    return headers;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return from(this.handle(req, next));
  }

  async handle(req: HttpRequest<any>, next: HttpHandler) {
    let request = req;
    if (request.url.startsWith('/')) {
      request = request.clone({
        url: `${environment.webApiUri}${request.url}`,
        setHeaders: await this.getHeaders(),
      });
    }
    return next
      .handle(request)
      .pipe(
        map((event: HttpEvent<any>) => {
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 403) {
            this.cognitoService.refreshSession().then(() => {
              this.router.navigate(['/members/projects']);
            });
          }
          return throwError(error);
        })
      )
      .toPromise();
  }
}
