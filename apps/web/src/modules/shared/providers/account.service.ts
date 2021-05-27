import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAccountAuthenticatedRequestDto, IAccountSummary } from '@monorepo/web-api-client';
import { IApiResponse } from '@monorepo/api-client';
import { ReplaySubject } from 'rxjs';
import { CookiePermissionState } from '../../app/components/cookie-disclaimer/cookie-disclaimer.component';
import { StorageKey, StorageService } from './storage.service';

@Injectable()
export class AccountService {
  cookiePermissionState: CookiePermissionState;
  summary$ = new ReplaySubject<IAccountSummary>(1);

  constructor(public httpClient: HttpClient, public storageService: StorageService) {
    this.storageService
      .findItem(StorageKey.COOKIE_PERMISSION_STATE)
      .subject.subscribe((state) => (this.cookiePermissionState = state));
  }

  clearSummary() {
    this.summary$.next(null);
  }

  onAuthenticated(): void {
    this.httpClient
      .post('/account/authenticated', {
        cookieUsageEnabled: this.cookiePermissionState?.accepted,
      } as IAccountAuthenticatedRequestDto)
      .subscribe(
        (response: IApiResponse<IAccountSummary>) => {
          this.summary$.next(response.payload);
        },
        (response: HttpErrorResponse) => {
          // TODO ?
        }
      );
  }

  toggleCookieUsageEnabled(enable: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(`/account/cookie-usage?enable=${enable}`, null).subscribe(
        (response: IApiResponse<any>) => {
          resolve();
        },
        (response: HttpErrorResponse) => {
          reject();
        }
      );
    });
  }
}
