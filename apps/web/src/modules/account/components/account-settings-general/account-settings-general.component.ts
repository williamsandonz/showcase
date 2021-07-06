import { Component, OnDestroy, OnInit } from '@angular/core';
import { constants, IUserSummaryVm } from '@monorepo/web-api-client';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService, CognitoService } from '../../../shared/providers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account-settings-general',
  templateUrl: './account-settings-general.component.html',
  styleUrls: ['./account-settings-general.component.scss'],
})
export class AccountSettingsGeneralComponent implements OnInit, OnDestroy {

  expandedPanelIndex = 0;
  name: string;
  processing: boolean;
  subscription1: Subscription;
  success: boolean;

  constructor(
    public userService: UserService,
    public cognitoService: CognitoService,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    this.subscription1 = this.userService.summary$.subscribe((summary: IUserSummaryVm) => {
      this.name = summary.name;
    });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

  setExpandedPanelIndex(index: number) {
    this.expandedPanelIndex = index;
  }

  onDetailsSaved() {
    this.expandedPanelIndex = -1;
  }

}
