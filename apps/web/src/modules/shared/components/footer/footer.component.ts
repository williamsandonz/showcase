import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { constants } from '@monorepo/web-api-client';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { CognitoService } from '../../providers';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  appName = constants.appName;
  authenticatedUser: CognitoUser;
  loaded = false;

  constructor(
    public cognitoService: CognitoService,
    public router: Router
  ) {}

  ngOnInit() {
    this.cognitoService.authenticatedUser$.subscribe(async (user) => {
      this.loaded = true;
      this.authenticatedUser = user;
    });
  }

}
