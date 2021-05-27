import { Component, OnInit } from '@angular/core';
import { constants } from '@monorepo/web-api-client';

@Component({
  selector: 'app-account-settings-details',
  templateUrl: './account-settings-details.component.html',
  styleUrls: ['./account-settings-details.component.scss'],
})
export class AccountSettingsDetailComponent implements OnInit {
  appName = constants.appName;

  constructor() {}

  ngOnInit() {
  }
}
