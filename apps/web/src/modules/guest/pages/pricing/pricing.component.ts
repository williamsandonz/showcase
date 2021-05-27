import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants } from '@monorepo/web-api-client';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  constructor(public titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Pricing`);
  }
}
