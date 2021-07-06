import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApiResponse } from '@monorepo/api-client';
import { IOrganisationInvitationVm } from '@monorepo/web-api-client';
import { httpRequestFailureMessage } from '../../../shared/common';

@Component({
  selector: 'app-resend-invitation.component',
  templateUrl: './resend-invitation.component.html',
  styleUrls: ['./resend-invitation.component.scss'],
})
export class ResendInvitationComponent implements OnInit {

  processing: boolean;
  requestError: string;

  constructor(
    public dialogRef: MatDialogRef<ResendInvitationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResendInvitationDialogData,
    public httpClient: HttpClient
  ) {}

  ngOnInit() {
  }

  closeDialog(invitation: IOrganisationInvitationVm = null) {
    this.dialogRef.close(invitation); // TODO ?
  }

  async onConfirm() {
    this.requestError = null;
    this.processing = true;
    this.httpClient
      .post(`/organisation-invitations/resend/${this.data.invitation.id}`, {})
      .subscribe(
        async (response: IApiResponse<IOrganisationInvitationVm>) => {
          this.processing = false;
          this.closeDialog(response.payload);
        },
        (response: HttpErrorResponse) => {
          this.processing = false;
          if(response.status === 403) {
            this.requestError = response.error.error.message;
          } else {
            this.requestError = httpRequestFailureMessage;
          }
        }
      );
  }
}

export interface ResendInvitationDialogData {
  invitation: IOrganisationInvitationVm;
}
