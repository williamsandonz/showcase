import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IUserSummaryVm } from '@monorepo/web-api-client';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserService } from '../../../shared/providers';
import { RoutingService } from '../../../shared/providers/routing.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss'],
})
export class ProjectSettingsComponent implements OnInit {

  activePagePath: string;
  projectName: string;
  pages: any[];
  subscription1: Subscription;

  constructor(
    public userService: UserService,
    private router: Router,
    private routingService: RoutingService,
    public titleService: Title
  ) {}

  ngOnInit() {
    this.userService.summary$.pipe(first()).subscribe(async (summary: IUserSummaryVm) => {
      const project = (await this.routingService.getCurrentProjectMembership()).project;
      const basePath = `${await this.routingService.getPagePathForProject(project)}settings`;
      this.pages = [
        {
          title: 'General',
          path: `${basePath}/general`
        },
        {
          title: 'Members',
          path: `${basePath}/members`
        },
        {
          title: 'SDK',
          path: `${basePath}/sdk`
        },
      ];
      this.projectName = project.name;
      this.initPage(this.pages.find(p => p.path === this.router.url));
    });
  }

  changePage(page: any) {
    this.router.navigate([page.path]);
    this.initPage(page);
  }

  initPage(page: any) {
    this.activePagePath = page.path;
    this.titleService.setTitle(`${this.projectName} ${page.title}`);
  }

}
