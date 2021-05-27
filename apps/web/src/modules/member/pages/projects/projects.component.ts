import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants, IAccountSummary, IProject, OrganisationPermissionType } from '@monorepo/web-api-client';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../../shared/providers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {

  isOrganisationAdmin: boolean;
  projects: IProject[];
  subscription1: Subscription;

  constructor(public accountService: AccountService, public titleService: Title, public httpClient: HttpClient) {}

  ngOnInit() {
    this.subscription1 = this.accountService.summary$.subscribe((summary: IAccountSummary) => {
      const organisationPermissions = summary.organisationMemberships.
        find(m => m.selected)
        .permissions;
      this.isOrganisationAdmin = organisationPermissions.some(p => p.type === OrganisationPermissionType.SUPER_USER);
      this.projects = summary.projectMemberships.map(m => m.project);
    });
    this.titleService.setTitle(`${constants.appName} - Projects`);
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }


}
