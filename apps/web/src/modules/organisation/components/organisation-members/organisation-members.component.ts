import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { IApiResponse } from '@monorepo/api-client';
import { IOrganisationMemberListResponseDto, IOrganisationMembershipVm, OrganisationPermissionType } from '@monorepo/web-api-client';
import { httpRequestFailureMessage } from '../../../shared/common';

@Component({
  selector: 'app-organisation-members',
  templateUrl: './organisation-members.component.html',
  styleUrls: ['./organisation-members.component.scss'],
})
export class OrganisationMembersComponent implements OnInit {

  displayPaginator: boolean;
  loading = true;
  loadingErrorMessage: string;
  members: IOrganisationMembershipVm[];
  page = 1;
  pageSize = 25;
  totalCount: number;

  constructor(
    public httpClient: HttpClient,
  ) {}

  ngOnInit() {
    this.getResultsForPage(1);
  }

  getResultsForPage(page: number) {
    this.httpClient
      .get(`/organisation-membership?page=${this.page}&per_page=50`)
      .subscribe(
        async (response: IApiResponse<IOrganisationMemberListResponseDto>) => {
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

  getRole(member: IOrganisationMembershipVm) {
    return member.permissions.some(p => p.type === OrganisationPermissionType.ADMIN) ? 'Admin' : 'Member';
  }

  onClickedChangePage(event: PageEvent) {
    this.getResultsForPage(event.pageIndex + 1);
  }

}
