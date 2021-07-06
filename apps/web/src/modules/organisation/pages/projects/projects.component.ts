import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants, IUserSummaryVm, IProjectVm, OrganisationPermissionType, ProjectPermissionType } from '@monorepo/web-api-client';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../shared/providers';
import { Subscription } from 'rxjs';
import { RoutingService } from '../../../shared/providers/routing.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {

  accountSummary: IUserSummaryVm;
  isOrganisationAdmin: boolean;
  organisationName: string;
  projects: IProjectVm[];
  projectIdsWhereAdmin: number[] = [];
  subscription1: Subscription;

  constructor(public userService: UserService, private routingService: RoutingService, public titleService: Title, public httpClient: HttpClient) {}

  ngOnInit() {
    this.subscription1 = this.userService.summary$.subscribe((summary: IUserSummaryVm) => {
      const selectedOrganisation = summary.organisationMemberships.find(m => m.selected);
      this.isOrganisationAdmin = selectedOrganisation
        .permissions.some(p => p.type === OrganisationPermissionType.ADMIN);
      this.organisationName = selectedOrganisation.organisation.name;
      this.accountSummary = summary;
      this.projects = summary.projectMemberships.map(m => m.project);
    });
    this.titleService.setTitle(`Projects`);
  }

  isProjectAdmin(project: IProjectVm) {
    return this.accountSummary.projectMemberships
      .find(m => m.project.id === project.id)
      .permissions.some(p => p.type === ProjectPermissionType.ADMIN);
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

  onCreateNewProjectClicked() {
    this.routingService.goToOrganisationPage('create-project');
  }

  goToProjectPage(project: IProjectVm, path: string, event: MouseEvent) {
    if(event) {
      event.stopPropagation();
    }
    this.routingService.goToProjectPage(project, path);
  }


}
