import { Component, OnInit } from '@angular/core';
import { constants } from '@monorepo/web-api-client';

@Component({
  selector: 'app-footer-guest',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterGuestComponent implements OnInit {
  appName = constants.appName;

  constructor() {}

  ngOnInit() {}
}
