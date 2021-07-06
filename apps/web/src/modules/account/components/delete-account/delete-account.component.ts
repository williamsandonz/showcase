import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CognitoService } from '../../../shared/providers';
import { regexValidator } from './../../../form';
import { IApiResponse } from '@monorepo/api-client';
import { Router } from '@angular/router';
import { httpRequestFailureMessage } from '../../../shared/common';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss'],
})
export class DeleteAccountComponent implements OnInit {

  form: FormGroup;
  formError: string;
  processing: boolean;

  constructor(
    public cognitoService: CognitoService,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      confirmation: ['', [regexValidator(/delete/i, 'Must be "delete"')]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.formError = null;
    this.processing = true;
    this.cognitoService
      .delete()
      .then(() => {
        this.httpClient.delete('/user').subscribe(
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
        this.formError = httpRequestFailureMessage;
      });
  }

  async onDeletionSuccess() {
    try {
      await this.cognitoService.signOut({ global: true });
    } catch (e) {
      console.error(e);
      // Fail silently
    } finally {
      this.processing = false;
      // Federated users will usually be redirected to redirectSignOut (in Cognito service)
      // But normal users won't so just send them all to homepage.
      this.router.navigate(['/']);
    }
  }
}
