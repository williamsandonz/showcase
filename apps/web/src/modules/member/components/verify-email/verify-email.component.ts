import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CognitoService } from '../../../shared/providers';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  form: FormGroup;
  errorMessage: string;
  processing: boolean;
  success: boolean;

  constructor(
    public cognitoService: CognitoService,
    public dialogRef: MatDialogRef<VerifyEmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IVerifyEmailDialogData,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      code: ['', [Validators.required]],
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
      await this.cognitoService.verifyUserAttributeSubmit('email', this.form.value.code);
      this.errorMessage = null;
      this.success = true;
      setTimeout(() => {
        this.closeDialog();
      }, 3000);
    } catch (e) {
      this.errorMessage = e.code === 'CodeMismatchException' ? 'Code is incorrect.' : 'Oops! Something has gone wrong';
    } finally {
      this.processing = false;
    }
  }
}

export interface IVerifyEmailDialogData {
  emailJustChanged: boolean;
  email: string;
}
