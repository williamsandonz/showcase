import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CognitoService } from '../../../shared/providers';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  processing: boolean;

  constructor(
    public cognitoService: CognitoService,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
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
    try {
      await this.cognitoService.forgotPassword(this.form.value.email);
      this.closeDialog(this.form.value.email);
    } catch (e) {
      this.form.get('email').setErrors({
        remote:
          e.code === 'ResourceNotFoundException'
            ? "Can't find a user matching this email address."
            : 'Oops! Something has gone wrong',
      });
    } finally {
      this.processing = false;
    }
  }
}
