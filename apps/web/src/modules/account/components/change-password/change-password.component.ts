import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { cognitoPasswordValidator, CognitoService } from '../../../shared/providers';
import { httpRequestFailureMessage, successMessageDisplayDuration } from '../../../shared/common';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  errorMessage: string;
  form: FormGroup;
  processing: boolean;
  @Output() saved = new EventEmitter<void>();
  success = false;

  constructor(
    public cognitoService: CognitoService,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      currentPassword: [''],
      password1: ['', cognitoPasswordValidator],
      password2: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    try {
      await this.cognitoService.changePassword(this.form.value.currentPassword, this.form.value.password1);
      this.errorMessage = null;
      this.success = true;
      setTimeout(() => {
        this.saved.emit();
      }, successMessageDisplayDuration);
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
        this.errorMessage = httpRequestFailureMessage;
      }
    } finally {
      this.processing = false;
    }
  }
}
