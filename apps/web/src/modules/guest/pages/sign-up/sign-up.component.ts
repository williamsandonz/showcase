import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { merge } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { applyServerErrorsToFormControls, regexValidator, truthyValidator } from './../../../form';
import { Router } from '@angular/router';
import { UserService, cognitoPasswordValidator, CognitoService } from './../../../shared/providers';
import { ISignUpRequestDto, validationMessages, validationConstraints } from '@monorepo/web-api-client';
import { IApiResponse } from '@monorepo/api-client';
import { RoutingService } from '../../../shared/providers/routing.service';
import { environment } from 'apps/web/src/environments/environment';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { httpRequestFailureMessage } from '../../../shared/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {

  form: FormGroup;
  formError: string;
  passwordValueChanges$: any;
  processing: boolean;
  recaptchaSiteKey = environment.recaptchaSiteKey;
  submitted = false;

  constructor(
    public userService: UserService,
    public cognitoService: CognitoService,
    public httpClient: HttpClient,
    public titleService: Title,
    public formBuilder: FormBuilder,
    public router: Router,
    private routingService: RoutingService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`Sign up`);
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      organisation: ['', [regexValidator(validationConstraints.urlableRegex, validationMessages.urlable)]],
      email: ['', [Validators.required]],
      password1: ['', cognitoPasswordValidator],
      password2: ['', cognitoPasswordValidator],
      recaptcha: ['', Validators.required],
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
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    const email = this.form.value.email;
    const password = this.form.value.password1;
    try {
      this.saveUser(
        await this.cognitoService.signUp(email, password) || await this.cognitoService.signIn(email, password)
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

  saveUser(cognitoUser: CognitoUser) {
    const formValue = this.form.value;
    this.formError = null;
    this.httpClient
    .post('/user/sign-up', {
      id: cognitoUser['attributes']['sub'],
      email: formValue.email,
      name: formValue.name,
      organisation: formValue.organisation,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    } as ISignUpRequestDto)
    .subscribe(
      async (response: IApiResponse<any>) => {
        await this.userService.onAuthenticated();
        this.cognitoService.authenticatedHookDisabled = false;
        this.processing = false;
        this.routingService.goToOrganisationPage('projects');
      },
      (response: HttpErrorResponse) => {
        this.processing = false;
        if(!applyServerErrorsToFormControls(response, this.form)) {
          this.formError = httpRequestFailureMessage;
        }
      }
    );
  }

}
