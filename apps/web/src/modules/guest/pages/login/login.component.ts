import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants } from '@monorepo/web-api-client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  ResetPasswordComponent,
  ResetPasswordSuccessDto,
} from '../../components/reset-password/reset-password.component';
import { CognitoService } from './../../../shared/providers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  processing: boolean;

  constructor(
    public cognitoService: CognitoService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public titleService: Title,
    public router: Router
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Login`);
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]],
      rememberMe: [false, Validators.required],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    try {
      const cognitoUser = await this.cognitoService.signIn(this.form.value.email, this.form.value.password);
      this.processing = false;
      this.router.navigate(['/members/projects']);
    } catch (e) {
      if (e.code === 'UserNotFoundException') {
        this.form.get('email').setErrors({
          remote: 'No account matching this email',
        });
      } else if (e.code === 'NotAuthorizedException') {
        this.form.get('password').setErrors({
          remote: 'Invalid password',
        });
      }
    }
  }

  openForgotPasswordDialog($event: MouseEvent) {
    $event.preventDefault();
    const dialogRef = this.dialog.open(ForgotPasswordComponent);
    dialogRef.afterClosed().subscribe((email: string) => {
      if (email) {
        this.openResetPasswordDialog(email);
      }
    });
  }

  openResetPasswordDialog(email: string) {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      data: {
        email,
      },
    });
    dialogRef.afterClosed().subscribe((dto: ResetPasswordSuccessDto) => {
      if (dto) {
        this.form.value.email = dto.email;
        this.form.value.password = dto.password;
        this.onSubmit();
      }
    });
  }
}
