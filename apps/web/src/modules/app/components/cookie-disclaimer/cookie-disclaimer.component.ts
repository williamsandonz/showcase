import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { IAccountSummary } from '@monorepo/web-api-client';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AccountService, CognitoService, StorageKey, StorageService } from '../../../shared/providers';

@Component({
  selector: 'app-cookie-disclaimer',
  templateUrl: './cookie-disclaimer.component.html',
  styleUrls: ['./cookie-disclaimer.component.scss'],
})
export class CookieDisclaimerComponent implements OnInit, OnDestroy {
  accountSummary: IAccountSummary;
  @HostBinding('class.displayed') display: boolean;
  loggedIn = false;
  subscription1: Subscription;

  constructor(
    public accountService: AccountService,
    public cognitoService: CognitoService,
    public storageService: StorageService
  ) {}

  ngOnInit() {
    this.subscription1 = this.accountService.summary$.subscribe((summary: IAccountSummary) => {
      if (summary.cookieUsageEnabled !== null && this.display) {
        this.display = false;
      }
    });
    this.storageService
      .findItem(StorageKey.COOKIE_PERMISSION_STATE)
      .subject.pipe(first())
      .subscribe((state: CookiePermissionState) => {
        this.display = !state;
      });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

  async close(accepted: boolean) {
    this.storageService.set(StorageKey.COOKIE_PERMISSION_STATE, {
      accepted,
    } as CookiePermissionState);
    this.display = false;
    if (!!this.cognitoService.authenticatedUser) {
      await this.accountService.toggleCookieUsageEnabled(accepted);
    }
  }
}

export interface CookiePermissionState {
  accepted: boolean;
}
