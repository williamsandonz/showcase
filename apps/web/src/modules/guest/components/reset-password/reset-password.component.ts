import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { cognitoPasswordValidators, CognitoService } from '../../../shared/providers';

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
  success: boolean;

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
      password1: ['', cognitoPasswordValidators],
      password2: ['', [Validators.required]],
    });
  }

  closeDialog(dto?: ResetPasswordSuccessDto): void {
    this.dialogRef.close(dto);
  }

  async onConfirm() {
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    try {
      await this.cognitoService.resetPassword(this.data.email, this.form.value.code, this.form.value.password1);
      this.success = true;
      setTimeout(() => {
        this.closeDialog({
          email: this.data.email,
          password: this.form.value.password1,
        });
      }, 2000);
    } catch (e) {
      this.errorMessage = e.code === 'CodeMismatchException' ? 'Code is incorrect.' : 'Oops! Something has gone wrong';
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
