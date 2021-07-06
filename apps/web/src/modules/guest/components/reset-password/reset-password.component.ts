import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { cognitoPasswordValidator, CognitoService } from '../../../shared/providers';
import { httpRequestFailureMessage } from '../../../shared/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  errorMessage: string;
  form: FormGroup;
  processing: boolean;

  constructor(
    public cognitoService: CognitoService,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResetPasswordInput,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      code: ['', [Validators.required]],
      password1: ['', cognitoPasswordValidator],
      password2: ['', [Validators.required]],
    });
  }

  closeDialog(dto: ResetPasswordSuccessDto = null): void {
    this.dialogRef.close(dto);
  }

  async onConfirm() {
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    try {
      await this.cognitoService.resetPassword(this.data.email, this.form.value.code, this.form.value.password1);
      this.closeDialog({
        email: this.data.email,
        password: this.form.value.password1,
      });
    } catch (e) {
      this.errorMessage = e.code === 'CodeMismatchException' ? 'Code is incorrect.' : httpRequestFailureMessage
    } finally {
      this.processing = false;
    }
  }
}

export interface ResetPasswordInput {
  email: string;
}

export interface ResetPasswordSuccessDto {
  email: string;
  password: string;
}
