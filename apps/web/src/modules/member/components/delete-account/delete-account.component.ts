import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CognitoService } from '../../../shared/providers';
import { regexValidator } from './../../../form';
import { IApiResponse } from '@monorepo/api-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent implements OnInit {
  cognitoDeletionFailed = false;
  form: FormGroup;
  processing: boolean;

  constructor(
    public cognitoService: CognitoService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DeleteAccountComponent>,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      confirmation: ['', [Validators.required, regexValidator(/delete/i, 'Must be "delete"')]],
    });
  }

  closeDialog(success = false): void {
    this.dialogRef.close(success);
  }

  async onConfirm() {
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    this.cognitoService
      .delete()
      .then(() => {
        this.httpClient.delete('/account').subscribe(
          async (response: IApiResponse<any>) => {
            await this.onDeletionSuccess();
          },
          async (response: HttpErrorResponse) => {
            // Deletion failed but display as success to User anyway and
            // our developers will manually delete information.
            await this.onDeletionSuccess();
          }
        );
      })
      .catch((e) => {
        this.processing = false;
        this.cognitoDeletionFailed = true;
      });
  }

  async onDeletionSuccess() {
    try {
      await this.cognitoService.signOut({ global: true });
    } catch (e) {
      // Fail silently
    } finally {
      this.processing = false;
      this.closeDialog(true);
    }
  }
}
