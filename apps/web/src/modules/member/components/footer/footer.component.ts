import { Component, OnInit } from '@angular/core';
import { constants } from '@monorepo/web-api-client';

@Component({
  selector: 'app-footer-member',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterMemberComponent implements OnInit {
  appName = constants.appName;

  constructor() {}

  ngOnInit() {
  }
}
