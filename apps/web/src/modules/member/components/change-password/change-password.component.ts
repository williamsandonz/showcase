import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { cognitoPasswordValidators, CognitoService } from '../../../shared/providers';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  errorMessage: string;
  form: FormGroup;
  processing: boolean;
  success: boolean;

  constructor(
    public cognitoService: CognitoService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      currentPassword: [''],
      password1: ['', cognitoPasswordValidators],
      password2: ['', [Validators.required]],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  async onConfirm() {
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    try {
      await this.cognitoService.changePassword(this.form.value.currentPassword, this.form.value.password1);
      this.errorMessage = null;
      this.success = true;
      setTimeout(() => {
        this.closeDialog();
      }, 2000);
    } catch (e) {
      if (e.code === 'NotAuthorizedException' || e.message.includes('previousPassword')) {
        this.form.get('currentPassword').setErrors({
          remote: 'Password is incorrect',
        });
      } else if (e.message.includes('proposedPassword')) {
        // Unlikely because our validation should prevent this, but just in case
        this.form.get('password1').setErrors({
          remote: 'Password format not supported, try something simpler.',
        });
      } else {
        this.errorMessage = 'Something has gone wrong';
      }
    } finally {
      this.processing = false;
    }
  }
}
