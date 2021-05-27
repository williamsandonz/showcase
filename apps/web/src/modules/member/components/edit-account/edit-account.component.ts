import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { constants } from '@monorepo/web-api-client';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ChangeEmailComponent } from '../change-email/change-email.component';
import { VerifyEmailComponent } from '../verify-email/verify-email.component';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoService } from '../../../shared/providers';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss'],
})
export class EditAccountComponent implements OnInit, OnDestroy {
  authenticatedUser: CognitoUser;
  email: string;
  emailVerified: boolean;
  processing: boolean;
  success: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    public cognitoService: CognitoService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public titleService: Title,
    public router: Router
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Edit account`);
    this.subscriptions.push(
      this.cognitoService.authenticatedUser$.subscribe(async (user) => {
        this.authenticatedUser = user;
        if (user) {
          const attributes = await this.cognitoService.userAttributes();
          this.email = attributes.find((attribute) => attribute.Name === 'email').Value;
          this.emailVerified = attributes.find((attribute) => attribute.Name === 'email_verified').Value === 'true';
        }
      })
    );
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePasswordComponent);
  }

  openChangeEmailDialog() {
    const dialogRef = this.dialog.open(ChangeEmailComponent);
    dialogRef.afterClosed().subscribe((email: string) => {
      if (email) {
        this.openVerifyEmailDialog(email, true);
      }
    });
  }

  openDeleteAccountDialog() {
    const dialogRef = this.dialog.open(DeleteAccountComponent);
    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.router.navigate(['/']);
      }
    });
  }

  openVerifyEmailDialog(email: string, emailJustChanged = false) {
    this.dialog.open(VerifyEmailComponent, {
      data: {
        email,
        emailJustChanged,
      },
    });
  }

  async resendVerificationCode() {
    await this.cognitoService.verifyUserAttribute('email');
    this.openVerifyEmailDialog(this.authenticatedUser['attributes'].email);
  }
}
