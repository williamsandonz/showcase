import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IApiResponse } from '@monorepo/api-client';
import { IUserSummaryVm, IOrganisationVm } from '@monorepo/web-api-client';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Subscription } from 'rxjs';
import { RoutingService } from '../../../shared/providers/routing.service';
import { UserService, CognitoService } from './../../../shared/providers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  accountName: string;
  authenticatedUser: CognitoUser;
  @HostBinding('class') cssClass;
  currentOrganisationBasePath: string;
  pageLinks = [];
  selectedOrganisationName: string;
  settingsMenuLoaded = false;
  subscription1: Subscription;
  switchableOrganisations: IOrganisationVm[] = [];

  constructor(
    public userService: UserService,
    public cognitoService: CognitoService,
    public httpClient: HttpClient,
    public router: Router,
    private routingService: RoutingService,
  ) {}

  async ngOnInit() {
    this.cognitoService.authenticatedUser$.subscribe(async (user) => {
      this.authenticatedUser = user;
      this.cssClass = this.authenticatedUser ? 'authenticated' : 'unauthenticated';
      await this.initLinks();
    });
    this.subscription1 = this.userService.summary$.subscribe((summary: IUserSummaryVm) => {
      this.switchableOrganisations = summary.organisationMemberships
        .filter(membership => !membership.selected)
        .map(membership => membership.organisation);
      this.selectedOrganisationName = summary.organisationMemberships.find(m => m.selected).organisation.name;
      this.accountName = summary.name;
      this.settingsMenuLoaded = true;
    });
  }

  async initLinks() {
    const documentationLink = {
      text: 'Docs',
      path: '/docs/platforms'
    };
    if(this.authenticatedUser) {
      this.currentOrganisationBasePath = await this.routingService.getPagePathForOrganisation();
      this.pageLinks = [
        {
          text: 'Projects',
          path: `${this.currentOrganisationBasePath}projects`
        },
        documentationLink
      ];
    } else {
      this.pageLinks = [
        {
          text: 'Products',
          path: '/product'
        },
        {
          text: 'Pricing',
          path: '/pricing'
        },
        documentationLink,
        {
          text: 'Login',
          path: '/login'
        },
        {
          text: 'Sign up',
          path: '/sign-up'
        }

      ];
    }
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

  async logout() {
    await this.cognitoService.signOut();
    // Using window.location instead of router otherwise we'd need to clear userService.summary
    // Then update subscribers to handle null values etc.
    window.location.href = '/';
  }

  onSwitchOrganisation(organisation: IOrganisationVm) {
    this.httpClient.post(`/organisation-membership/select/${organisation.id}`, {}).subscribe(
      (response: IApiResponse<void>) => {

        const refreshWhitelist = [
          // TODO
        ];
        if(refreshWhitelist.includes(this.router.url)) {
          window.location.reload();
        } else {
          window.location.href = `/orgs/${organisation.slug}/projects`;
        }
      },
      (response: HttpErrorResponse) => {
        // TODO
      }
    );
  }

  onLinkClick(event: MouseEvent) {
    //event.preventDefault();
    //event.stopPropagation();
  }

}
