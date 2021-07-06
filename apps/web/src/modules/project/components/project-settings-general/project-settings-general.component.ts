import { Component, OnInit } from '@angular/core';
import { IUserSummaryVm, IProjectVm } from '@monorepo/web-api-client';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService, CognitoService } from '../../../shared/providers';
import { Subscription } from 'rxjs';
import { RoutingService } from '../../../shared/providers/routing.service';

@Component({
  selector: 'app-project-settings-general',
  templateUrl: './project-settings-general.component.html',
  styleUrls: ['./project-settings-general.component.scss'],
})
export class ProjectSettingsGeneralComponent implements OnInit {

  expandedPanelIndex = 0;
  processing: boolean;
  project: IProjectVm;
  subscription1: Subscription;
  success: boolean;

  constructor(
    public userService: UserService,
    public cognitoService: CognitoService,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public router: Router,
    public routingService: RoutingService
  ) {}

  ngOnInit() {
    this.subscription1 = this.userService.summary$.subscribe(async (summary: IUserSummaryVm) => {
      this.project = (await this.routingService.getCurrentProjectMembership()).project;
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
