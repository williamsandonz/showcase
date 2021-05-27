import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IApiResponse } from '@monorepo/api-client';
import { IAccountSummary, IOrganisation } from '@monorepo/web-api-client';
import { Subscription } from 'rxjs';
import { AccountService, CognitoService } from './../../../shared/providers';

@Component({
  selector: 'app-header-member',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderMemberComponent implements OnInit, OnDestroy {

  accountName: string;
  selectedOrganisationName: string;
  settingsMenuLoaded = false;
  subscription1: Subscription;
  switchableOrganisations: IOrganisation[] = [];

  constructor(
    public accountService: AccountService,
    public cognitoService: CognitoService,
    public httpClient: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    this.subscription1 = this.accountService.summary$.subscribe((summary: IAccountSummary) => {
      this.switchableOrganisations = summary.organisationMemberships
        .filter(membership => !membership.selected)
        .map(membership => membership.organisation);
      this.selectedOrganisationName = summary.organisationMemberships.find(m => m.selected).organisation.name;
      this.accountName = summary.name;
      this.settingsMenuLoaded = true;
    });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

  async logout() {
    await this.cognitoService.signOut();
    this.accountService.clearSummary();
    this.router.navigate(['/']);
  }

  onSwitchOrganisation(organisation: IOrganisation) {
    this.httpClient.post(`/organisation-membership/select/${organisation.id}`, {}).subscribe(
      (response: IApiResponse<void>) => {
        const refreshBlacklist = [
          // TODO
        ];
        if(refreshBlacklist.includes(this.router.url)) {
          window.location.href = '/members/projects';
        } else {
          window.location.reload();
        }
      },
      (response: HttpErrorResponse) => {
        // TODO
      }
    );
  }

}
