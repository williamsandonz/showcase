import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IUserSummaryVm } from '@monorepo/web-api-client';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { UserService } from '../../../shared/providers';
import { RoutingService } from '../../../shared/providers/routing.service';

@Component({
  selector: 'app-organisation-settings',
  templateUrl: './organisation-settings.component.html',
  styleUrls: ['./organisation-settings.component.scss'],
})
export class OrganisationSettingsComponent implements OnInit {

  activePagePath: string;
  organisationName: string;
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
      const basePath = `${await this.routingService.getPagePathForOrganisation()}settings`;
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
          title: 'Integrations',
          path: `${basePath}/integrations`
        },
        {
          title: 'Subscription',
          path: `${basePath}/subscriptions`
        }
      ];
      this.organisationName = summary.organisationMemberships.find(m => m.selected).organisation.name;
      this.initPage(this.pages.find(p => p.path === this.router.url));
    });
  }

  changePage(page: any) {
    this.router.navigate([page.path]);
    this.initPage(page);
  }

  initPage(page: any) {
    this.activePagePath = page.path;
    this.titleService.setTitle(`${this.organisationName} - ${page.title}`);
  }

}
