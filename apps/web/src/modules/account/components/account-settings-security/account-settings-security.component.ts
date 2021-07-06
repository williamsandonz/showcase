import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoService } from '../../../shared/providers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-settings-security',
  templateUrl: './account-settings-security.component.html',
  styleUrls: ['./account-settings-security.component.scss'],
})
export class AccountSettingsSecurityComponent implements OnInit, OnDestroy {

  authenticatedUser: CognitoUser;
  email: string;
  emailVerified: boolean;
  expandedPanelIndex: number;
  processing: boolean;
  success: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    public cognitoService: CognitoService,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.cognitoService.authenticatedUser$.subscribe(async (user) => {
        this.authenticatedUser = user;
        if (user) {
          const attributes = await this.cognitoService.userAttributes();
          this.email = attributes.find((attribute) => attribute.Name === 'email').Value;
          this.emailVerified = attributes.find((attribute) => attribute.Name === 'email_verified').Value === 'true';
        }
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  setExpandedPanelIndex(index: number) {
    this.expandedPanelIndex = index;
  }

  onChangeEmailSaved() {
    this.expandedPanelIndex = -1;
  }

  onChangePasswordSaved() {
    this.expandedPanelIndex = -1;
  }

}
