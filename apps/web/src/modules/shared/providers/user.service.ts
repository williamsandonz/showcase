import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAccountAuthenticatedRequestDto, IUserSummaryVm } from '@monorepo/web-api-client';
import { IApiResponse } from '@monorepo/api-client';
import { ReplaySubject } from 'rxjs';
import { CookiePermissionState } from '../../app/components/cookie-disclaimer/cookie-disclaimer.component';
import { StorageKey, StorageService } from './storage.service';
import { utcToZonedTime } from 'date-fns-tz'

@Injectable()
export class UserService {
  cookiePermissionState: CookiePermissionState;
  summary$ = new ReplaySubject<IUserSummaryVm>(1);

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
      .post('/user/authenticated', {
        cookieUsageEnabled: this.cookiePermissionState?.accepted,
      } as IAccountAuthenticatedRequestDto)
      .subscribe(
        (response: IApiResponse<IUserSummaryVm>) => {
          const payload = response.payload;
          this.summary$.next({
            ...payload,
            dateJoined: utcToZonedTime(payload.dateJoined, payload.timezone)
          });
        },
        (response: HttpErrorResponse) => {
          // TODO ?
        }
      );
  }

  toggleCookieUsageEnabled(enable: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpClient.post(`/user/cookie-usage?enable=${enable}`, null).subscribe(
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
