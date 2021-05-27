import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants } from '@monorepo/web-api-client';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
})
export class SupportComponent implements OnInit {
  appName = constants.appName;
  supportEmail = constants.emails.support;

  constructor(public titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Support`);
  }
}
