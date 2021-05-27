import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IAccountSummary } from '@monorepo/web-api-client';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AccountService } from '../../../shared/providers';

@Component({
  selector: 'app-organisation-settings',
  templateUrl: './organisation-settings.component.html',
  styleUrls: ['./organisation-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrganisationSettingsComponent implements OnInit {

  organisationName: string
  subscription1: Subscription;

  constructor(
    public accountService: AccountService,
  ) {}

  ngOnInit() {
    this.accountService.summary$.pipe(first()).subscribe((summary: IAccountSummary) => {
      this.organisationName = summary.organisationMemberships.find(m => m.selected).organisation.name;
    });
  }

}
