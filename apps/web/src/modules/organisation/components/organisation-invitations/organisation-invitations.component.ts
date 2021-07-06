import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { IApiResponse } from '@monorepo/api-client';
import { IOrganisationInvitationListResponseDto, IOrganisationInvitationVm, IUserSummaryVm, OrganisationPermissionType } from '@monorepo/web-api-client';
import { httpRequestFailureMessage } from '../../../shared/common';
import { UserService } from '../../../shared/providers';
import { ResendInvitationComponent, ResendInvitationDialogData } from '../resend-invitation/resend-invitation.component';

@Component({
  selector: 'app-organisation-invitations',
  templateUrl: './organisation-invitations.component.html',
  styleUrls: ['./organisation-invitations.component.scss'],
})
export class OrganisationInvitationsComponent implements OnInit {

  isAdmin: boolean;
  displayPaginator: boolean;
  invitations: IOrganisationInvitationVm[];
  pageSize = 25;
  loading = true;
  loadingErrorMessage: string;
  totalCount: number;

  constructor(
    public dialog: MatDialog,
    public httpClient: HttpClient,
    public userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.summary$.subscribe((summary: IUserSummaryVm) => {
      this.isAdmin = summary.organisationMemberships.find(m => m.selected).permissions.some(p => p.type === OrganisationPermissionType.ADMIN);
    });
    this.getResultsForPage(1);
  }

  deleteInvitation(invitation: IOrganisationInvitationVm) {
    this.httpClient
      .delete(`/organisation-invitations?id=${invitation.id}`)
      .subscribe(
      async (response: IApiResponse<void>) => {
        this.invitations = this.invitations.filter(inv => inv.id !== invitation.id);
      },
      (response: HttpErrorResponse) => {
        // TODO
      }
    );
  }

  getResultsForPage(page: number) {
    this.httpClient
      .get(`/organisation-invitations?page=${page}&per_page=${this.pageSize}`)
      .subscribe(
      async (response: IApiResponse<IOrganisationInvitationListResponseDto>) => {
        this.loadingErrorMessage = null;
        const payload = response.payload;
        this.totalCount = payload.total;
        this.invitations = payload.invitations;
        this.displayPaginator = this.totalCount > this.invitations.length;
        this.loading = false;
      },
      (response: HttpErrorResponse) => {
        this.loading = false;
        this.loadingErrorMessage = httpRequestFailureMessage;
      }
    );
  }

  onInviteSent(invitation: IOrganisationInvitationVm) {
    this.invitations.push(invitation);
  }

  onClickedChangePage(event: PageEvent) {
    this.getResultsForPage(event.pageIndex + 1);
  }

  resendInvitation(invitation: IOrganisationInvitationVm) {
    const dialogRef = this.dialog.open(ResendInvitationComponent, {
      data: {
        invitation: invitation,
      } as ResendInvitationDialogData
    });
    dialogRef.afterClosed().subscribe((invitation: IOrganisationInvitationVm) => { // TODO
    });
  }


}
