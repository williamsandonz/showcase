import { Component, OnInit } from '@angular/core';
import { constants } from '@monorepo/web-api-client';

@Component({
  selector: 'app-organisation-settings-general',
  templateUrl: './organisation-settings-general.component.html',
  styleUrls: ['./organisation-settings-general.component.scss'],
})
export class OrganisationSettingsGeneralComponent implements OnInit {
  appName = constants.appName;

  constructor() {}

  ngOnInit() {
  }
}
