import { Component, OnInit } from '@angular/core';
import { constants } from '@monorepo/web-api-client';

@Component({
  selector: 'app-account-settings-subscriptions',
  templateUrl: './account-settings-subscriptions.component.html',
  styleUrls: ['./account-settings-subscriptions.component.scss'],
})
export class AccountSettingsSubscriptionsComponent implements OnInit {

  appName = constants.appName;

  constructor() {}

  ngOnInit() {
  }

}
