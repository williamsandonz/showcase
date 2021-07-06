import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CognitoService } from '../../../shared/providers';
import { MatDialog } from '@angular/material/dialog';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { IApiResponse } from '@monorepo/api-client';
import { applyServerErrorsToFormControls } from '../../../form';
import { httpRequestFailureMessage, successMessageDisplayDuration } from '../../../shared/common';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
})
export class ChangeEmailComponent implements OnInit {
  authenticatedUser: CognitoUser;
  email: string;
  emailVerified: boolean;
  form: FormGroup;
  formError: string;
  @Output() saved = new EventEmitter<void>();
  processing: boolean;
  success = false;

  constructor(
    public cognitoService: CognitoService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.cognitoService.authenticatedUser$.subscribe(async (user) => {
      this.authenticatedUser = user;
      const attributes = await this.cognitoService.userAttributes();
      this.email = attributes.find((attribute) => attribute.Name === 'email').Value;
      this.emailVerified = attributes.find((attribute) => attribute.Name === 'email_verified').Value === 'true';
      if(!this.form) {
        this.form = this.formBuilder.group({
          email: [this.email, [Validators.required]],
        });
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.formError = null;
    this.processing = true;
    await this.updateCognitoRecord();
    this.httpClient
      .post(`/account/edit-email?email=${this.form.value.email}`, {})
      .subscribe(
        async (response: IApiResponse<void>) => {
          this.emailVerified = false;
          this.processing = false;
          this.openVerifyEmailDialog(this.form.value.email, true);
        },
        (response: HttpErrorResponse) => {
          this.processing = false;
          if(!applyServerErrorsToFormControls(response, this.form)) {
            this.formError = httpRequestFailureMessage;
          }
        }
      );
  }

  async updateCognitoRecord() {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.cognitoService.updateUserAttributes({
          email: this.form.value.email,
        });
        resolve();
      } catch(e) {
        const formControl = this.form.get('email');
        if (e.code === 'InvalidParameterException') {
          formControl.setErrors({
            remote: 'Email format is wrong',
          });
        } else if (e.code === 'AliasExistsException') {
          formControl.setErrors({
            remote: 'An account with this email address already exists',
          });
        } else {
          this.formError = httpRequestFailureMessage;
        }
        this.processing = false;
        reject();
      }
    });
  }

  openVerifyEmailDialog(email: string, emailJustChanged = false) {
    const dialogRef = this.dialog.open(VerifyEmailComponent, {
      data: {
        email,
        emailJustChanged,
      },
    });
    dialogRef.afterClosed().subscribe((success) => {
      this.emailVerified = success;
      if(success) {
        this.success = true;
        setTimeout(async () => {
          this.saved.emit();
        }, successMessageDisplayDuration);
      }
    });
  }

  async resendVerificationCode() {
    await this.cognitoService.verifyUserAttribute('email');
    this.openVerifyEmailDialog(this.authenticatedUser['attributes'].email);
  }

}
