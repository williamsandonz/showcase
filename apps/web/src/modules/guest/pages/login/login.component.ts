import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IOrganisationInvitationVm } from '@monorepo/web-api-client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ResetPasswordComponent,
  ResetPasswordSuccessDto,
} from '../../components/reset-password/reset-password.component';
import { CognitoService, StorageKey, StorageService } from './../../../shared/providers';
import { RoutingService } from '../../../shared/providers/routing.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  invitation: IOrganisationInvitationVm;
  journey: LoginPageJourneys;
  form: FormGroup;
  processing: boolean;

  constructor(
    public activatedRoute: ActivatedRoute,
    public cognitoService: CognitoService,
    public dialog: MatDialog,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    private routingService: RoutingService,
    public storageService: StorageService,
    public titleService: Title,
    public router: Router
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`Login`);
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]],
      rememberMe: [false, Validators.required],
    });
    this.initJourneys();
  }

  async initJourneys() {
    const journey = this.activatedRoute.snapshot.queryParams.journey;
    if(journey) {
      this.journey = parseInt(journey, 10);
    }
    if(this.journey === LoginPageJourneys.ACCEPT_INVITE_FOR_EXISTING_USER) {
      this.storageService.findItem(StorageKey.INVITE).subject.pipe(first()).subscribe((invitation: IOrganisationInvitationVm) => {
        this.invitation = invitation;
        this.form.get('email').setValue(invitation.email);
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    try {
      if (this.journey === LoginPageJourneys.ACCEPT_INVITE_FOR_EXISTING_USER) {
        // Defer receiving AccountSummary until we have accepted invite to new organisation
        this.cognitoService.authenticatedHookDisabled = true;
      }
      await this.cognitoService.signIn(this.form.value.email, this.form.value.password);
      this.processing = false;
      if (this.journey === undefined) {
        this.routingService.goToOrganisationPage('projects');
      } else if(this.journey === LoginPageJourneys.ACCEPT_INVITE_FOR_EXISTING_USER) {
        this.router.navigateByUrl(`/accept-invitation?secret=${this.invitation.secret}`);
      }

    } catch (e) {
      this.processing = false;
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
        this.form.get('email').setValue(dto.email);
        this.form.get('password').setValue(dto.password);
        this.onSubmit();
      }
    });
  }
}

export enum LoginPageJourneys {
  ACCEPT_INVITE_FOR_EXISTING_USER
}
