import { Component, OnInit } from '@angular/core';
import { constants } from '@monorepo/web-api-client';

@Component({
  selector: 'app-organisation-settings-integrations',
  templateUrl: './organisation-settings-integrations.component.html',
  styleUrls: ['./organisation-settings-integrations.component.scss'],
})
export class OrganisationSettingsIntegrationsComponent implements OnInit {
  appName = constants.appName;

  constructor() {}

  ngOnInit() {
  }
}
