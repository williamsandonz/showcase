import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
})
export class AccountSettingsComponent implements OnInit {

  activePagePath: string;
  pages = [
    {
      title: 'General',
      path: '/account/settings/general'
    },
    {
      title: 'Notifications',
      path: '/account/settings/notifications'
    },
    {
      title: 'Security',
      path: '/account/settings/security'
    }//,
    //{
    //  title: 'Email subscriptions',
    //  path: '/account/settings/subscriptions'
    //}
  ];

  constructor(private router: Router, public titleService: Title) {}

  ngOnInit() {
    this.initPage(this.pages.find(p => p.path === this.router.url));
  }

  changePage(page: any) {
    this.router.navigate([page.path]);
    this.initPage(page);
  }

  initPage(page: any) {
    this.activePagePath = page.path;
    this.titleService.setTitle(`Account - ${page.title}`);
  }

}
