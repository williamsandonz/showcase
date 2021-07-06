import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { merge } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { applyServerErrorsToFormControls, truthyValidator } from './../../../form';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, cognitoPasswordValidator, CognitoService, StorageKey, StorageService } from './../../../shared/providers';
import { IAcceptInvitationRequestDto, IOrganisationInvitationVm, IOrganisationInvitationRecipientStatusResponseDto, validationMessages } from '@monorepo/web-api-client';
import { IApiResponse } from '@monorepo/api-client';
import { RoutingService } from '../../../shared/providers/routing.service';
import { LoginPageJourneys } from '../login/login.component';
import { first } from 'rxjs/operators';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { httpRequestFailureMessage } from '../../../shared/common';

@Component({
  selector: 'app-accept-invitation',
  templateUrl: './accept-invitation.component.html',
  styleUrls: ['./accept-invitation.component.scss'],
})
export class AcceptInvitationComponent implements OnInit {

  form: FormGroup;
  formError: string;
  invitation: IOrganisationInvitationVm;
  loadingError: string;
  passwordValueChanges$: any;
  processing: boolean;
  secret: string;
  submitted = false;

  constructor(
    public userService: UserService,
    public activatedRoute: ActivatedRoute,
    public cognitoService: CognitoService,
    public httpClient: HttpClient,
    public titleService: Title,
    public formBuilder: FormBuilder,
    public router: Router,
    private routingService: RoutingService,
    public storageService: StorageService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`Accept invitation`);
    this.secret = this.activatedRoute.snapshot.queryParams.secret;
    this.cognitoService.authenticatedUser$.pipe(first()).subscribe(async (user: CognitoUser) => {
      if (user) {
        this.acceptAsExistingUser();
      } else {
        this.getRecipientStatus();
      }
    });
  }

  acceptAsExistingUser() {
    this.httpClient
    .post(`/organisation-invitations/accept-as-existing-user/${this.secret}`, {})
    .subscribe(
      async (response: IApiResponse<void>) => {
        // Manually get Account Summary now that new Organisation added.
        await this.userService.onAuthenticated();
        // Reverse the set done from Login component
        this.cognitoService.authenticatedHookDisabled = false;
        await this.routingService.goToOrganisationPage('projects');
      },
      (response: HttpErrorResponse) => {
        if(response.status === 403) {
          this.loadingError = response.error.error.message;
        } else {
          this.loadingError = httpRequestFailureMessage;
        }
      }
    );
  }

  getRecipientStatus() {
    this.httpClient
      .get(`/organisation-invitations/recipient-status/${this.secret}`)
      .subscribe(
        async (response: IApiResponse<IOrganisationInvitationRecipientStatusResponseDto>) => {
          const dto = response.payload;
          if (dto.accountExists) {
            await this.storageService.set<IOrganisationInvitationVm>(StorageKey.INVITE, dto.invitation);
            return this.router.navigateByUrl(`/login?journey=${LoginPageJourneys.ACCEPT_INVITE_FOR_EXISTING_USER}`);
          }
          if (dto.invitation.expiresInDays < 0) {
            this.loadingError = `This link has expired please ask ${dto.invitation.inviter.name} to send you a fresh one.`;
            return;
          }
          this.invitation = dto.invitation;
          this.initForm();
        },
        (response: HttpErrorResponse) => {
          if (response.status === 404) {
            this.router.navigate(['/']);
          }
          this.loadingError = httpRequestFailureMessage;
        }
      );
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      password1: ['', cognitoPasswordValidator],
      password2: ['', cognitoPasswordValidator],
      rememberMe: [false, Validators.required],
      termsAccepted: [false, truthyValidator('You must accept the terms and conditions.')],
    });
    const passwordControl = this.form.controls.password1;
    const confirmPasswordControl = this.form.controls.password2;
    // TODO should unsubscribe
    this.passwordValueChanges$ = merge(passwordControl.valueChanges, confirmPasswordControl.valueChanges).subscribe(
      () => {
        if (passwordControl.value !== confirmPasswordControl.value) {
          passwordControl.setErrors({ matchesOther: 'Passwords must match' });
        } else if (passwordControl.hasError('matchesOther')) {
          const { errorToRemove, ...errors } = passwordControl.errors;
          passwordControl.setErrors(errors);
          passwordControl.updateValueAndValidity();
        }
      }
    );
  }

  async onSubmit() {
    this.submitted = true;
    this.formError = null
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    const password = this.form.value.password1;
    try {
      this.acceptAsANewUser(
        await this.cognitoService.signUp(this.invitation.email, password) || await this.cognitoService.signIn(this.invitation.email, password)
      );
    } catch(e) {
      if (e.code === 'NotAuthorizedException') {
        // NB: This is a very rare but handled edge case here. If cognito sign up suceeds and /account/sign-up fails.
        // And they then don't use same PW they used when Cognito user created, they'll be stuck here.
      } else if (e.code === 'UsernameExistsException') {
        this.form.get('email').setErrors({
          unique: validationMessages.uniqueAccount,
        });
      } else {
        this.formError = httpRequestFailureMessage;
      }
    } finally {
      this.processing = false;
    }


  }

  acceptAsANewUser(cognitoUser: CognitoUser) {
    this.httpClient
      .post('/organisation-invitations/accept-as-new-user', {
        name: this.form.value.name,
        secret: this.secret,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      } as IAcceptInvitationRequestDto)
      .subscribe(
        async (response: IApiResponse<any>) => {
          await this.userService.onAuthenticated();
          this.cognitoService.authenticatedHookDisabled = false;
          this.formError = null;
          this.processing = false;
          await this.routingService.goToOrganisationPage('projects');
        },
        (response: HttpErrorResponse) => {
          this.processing = false;
          if(!applyServerErrorsToFormControls(response, this.form)) {
            this.loadingError = httpRequestFailureMessage;
          }
        }
      );
  }

}
