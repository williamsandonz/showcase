import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IUserSummaryVm, IProjectVm, IProjectMembershipVm } from '@monorepo/web-api-client';
import { UserService } from './user.service';

@Injectable()
export class RoutingService {

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
  }

  async getCurrentProjectMembership(): Promise<IProjectMembershipVm> {
    return new Promise((resolve, reject) => {
      this.getLastAccountSummary().subscribe((summary: IUserSummaryVm) => {
        resolve(summary.projectMemberships.find(m => m.project.id === parseInt(this.router.url.split('/')[3], 10)));
      });
    });
  }

  private getLastAccountSummary() {
    return this.userService.summary$;
  }

  async getPagePathForOrganisation(path =''): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getLastAccountSummary().subscribe((summary: IUserSummaryVm) => {
        const slug = summary.organisationMemberships.find(m => m.selected).organisation.slug;
        resolve(`/orgs/${(slug)}/${path}`);
      });
    });
  }

  async getPagePathForProject(project: IProjectVm, path?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.getLastAccountSummary().subscribe((summary: IUserSummaryVm) => {
        const p = summary.projectMemberships.find(m => m.project.id === project.id).project;
        resolve(`/projects/${p.slug}/${p.id}/${path || ''}`);
      });
    });
  }

  async goToOrganisationPage(path): Promise<Boolean> {
    return this.router.navigate([await this.getPagePathForOrganisation(path)]);
  }

  async goToProjectPage(project: IProjectVm, path: string): Promise<Boolean> {
    return this.router.navigate([await this.getPagePathForProject(project, path)]);
  }

}
