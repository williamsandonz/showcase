import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { IApiResponse } from '@monorepo/api-client';
import { IProjectMemberListResponseDto, ProjectPermissionType, IProjectMembershipVm, IUserSummaryVm, IProjectVm } from '@monorepo/web-api-client';
import { first } from 'rxjs/operators';
import { httpRequestFailureMessage } from '../../../shared/common';
import { UserService } from '../../../shared/providers';
import { RoutingService } from '../../../shared/providers/routing.service';

@Component({
  selector: 'app-project-settings-members',
  templateUrl: './project-settings-members.component.html',
  styleUrls: ['./project-settings-members.component.scss'],
})
export class ProjectSettingsMembersComponent implements OnInit {

  displayPaginator: boolean;
  loading = true;
  loadingErrorMessage: string;
  members: IProjectMembershipVm[];
  page = 1;
  pageSize = 25;
  project: IProjectVm;
  totalCount: number;

  constructor(
    public userService: UserService,
    public httpClient: HttpClient,
    public router: Router,
    public routingService: RoutingService,
  ) {}

  ngOnInit() {
    this.userService.summary$.pipe(first()).subscribe(async (summary: IUserSummaryVm) => {
      this.project = (await this.routingService.getCurrentProjectMembership()).project;
      this.getResultsForPage(1);
    });
  }

  getResultsForPage(page: number) {
    this.httpClient
      .get(`/project-membership/members/${this.project.id}?page=${this.page}&per_page=50`)
      .subscribe(
        async (response: IApiResponse<IProjectMemberListResponseDto>) => {
          this.loadingErrorMessage = null;
          const payload = response.payload;
          this.totalCount = payload.total;
          this.members = payload.members;
          this.displayPaginator = this.totalCount > this.members.length;
          this.loading = false;
        },
        (response: HttpErrorResponse) => {
          this.loading = false;
          this.loadingErrorMessage = httpRequestFailureMessage;
        }
      );
  }

  getRole(member: IProjectMembershipVm) {
    return member.permissions.some(p => p.type === ProjectPermissionType.ADMIN) ? 'Admin' : 'Member';
  }

  onClickedChangePage(event: PageEvent) {
    this.getResultsForPage(event.pageIndex + 1);
  }

}
