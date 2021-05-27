import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants } from '@monorepo/web-api-client';
import { environment } from 'apps/web/src/environments/environment';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {

  appName = constants.appName;
  legalOwner = constants.legalOwner;
  supportEmail = environment.email.support;

  constructor(public titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Privacy policy`);
  }

}
