import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IApiResponse } from '@monorepo/api-client';
import { IOrganisationInvitationVm, IOrganisationInvitationRequestDto } from '@monorepo/web-api-client';
import { applyServerErrorsToFormControls } from '../../../form';
import { httpRequestFailureMessage } from '../../../shared/common';

@Component({
  selector: 'app-invite-organisation-member',
  templateUrl: './invite-organisation-member.component.html',
  styleUrls: ['./invite-organisation-member.component.scss'],
})
export class InviteOrganisationMemberComponent implements OnInit {

  form: FormGroup;
  formError: string;
  processing: boolean;

  constructor(
    public dialogRef: MatDialogRef<InviteOrganisationMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  closeDialog(invitation: IOrganisationInvitationVm = null) {
    this.dialogRef.close(invitation);
  }

  async onSubmit() {
    if (!this.form.valid) {
      return;
    }
    this.formError = null;
    const formValue = this.form.value;
    this.httpClient
      .post('/organisation-invitations/invite', {
        email: formValue.email,
      } as IOrganisationInvitationRequestDto)
      .subscribe(
        async (response: IApiResponse<IOrganisationInvitationVm>) => {
          this.processing = false;
          this.closeDialog(response.payload);
        },
        (response: HttpErrorResponse) => {
          this.processing = false;
          if(applyServerErrorsToFormControls(response, this.form)) {
            return;
          }
          if(response.status === 403) {
            this.formError = response.error.error.message;
          } else {
            this.formError = httpRequestFailureMessage;
          }
        }
      );
  }
}
