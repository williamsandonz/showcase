import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CognitoService } from '../../../shared/providers';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss'],
})
export class ChangeEmailComponent implements OnInit {
  form: FormGroup;
  errorMessage: string;
  processing: boolean;

  constructor(
    public cognitoService: CognitoService,
    public dialogRef: MatDialogRef<ChangeEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
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
      await this.cognitoService.updateUserAttributes({
        email: this.form.value.email,
      });
      this.errorMessage = null;
      this.closeDialog(this.form.value.email);
    } catch (e) {
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
        this.errorMessage = 'Something has gone wrong';
      }
    } finally {
      this.processing = false;
    }
  }
}
