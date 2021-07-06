import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants } from '@monorepo/web-api-client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home-guest',
  templateUrl: './home-guest.component.html',
  styleUrls: ['./home-guest.component.scss'],
})
export class HomeGuestComponent implements OnInit {

  appName = constants.appName;
  constructor(public titleService: Title, public httpClient: HttpClient) {}

  ngOnInit() {
    this.titleService.setTitle(`Welcome`);
  }

}
