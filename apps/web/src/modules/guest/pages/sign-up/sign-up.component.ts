import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { merge, Subject } from 'rxjs';
import { constants } from '@monorepo/web-api-client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { applyServerErrorsToForm, truthyValidator } from './../../../form';
import { Router } from '@angular/router';
import { AccountService, cognitoPasswordValidators, CognitoService } from './../../../shared/providers';
import { ISignUpRequestDto, validationMessages } from '@monorepo/web-api-client';
import { IApiResponse } from '@monorepo/api-client';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  form: FormGroup;
  formError: boolean;
  passwordValueChanges$: any;
  processing: boolean;
  submitted = false;

  constructor(
    public accountService: AccountService,
    public cognitoService: CognitoService,
    public httpClient: HttpClient,
    public titleService: Title,
    public formBuilder: FormBuilder,
    public router: Router
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Sign up`);
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      organisation: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password1: ['', cognitoPasswordValidators],
      password2: ['', cognitoPasswordValidators],
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    if (!(await this.signUpWithCognito())) {
      return;
    }
    const formValue = this.form.value;
    const cognitoUser = await this.cognitoService.signIn(formValue.email, formValue.password1);
    this.httpClient
      .post('/account/sign-up', {
        id: cognitoUser['attributes'].sub,
        name: formValue.name,
        organisation: formValue.organisation,
      } as ISignUpRequestDto)
      .subscribe(
        async (response: IApiResponse<any>) => {
          await this.accountService.onAuthenticated();
          this.cognitoService.authenticatedHookDisabled = false;
          this.formError = false;
          this.processing = false;
          this.router.navigate(['/members/projects']);
        },
        (response: HttpErrorResponse) => {
          this.processing = false;
          applyServerErrorsToForm(response, this.form);
        }
      );
  }

  async signUpWithCognito(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        // Defer calling onAuthenticated until sign-up called (So that account exists)
        this.cognitoService.authenticatedHookDisabled = true;
        const user = await this.cognitoService.signUp(this.form.value.email, this.form.value.password1);
        resolve(true);
      } catch (e) {
        if (e.code === 'UsernameExistsException') {
          this.form.get('email').setErrors({
            unique: validationMessages.accountExists,
          });
        } else {
          this.formError = true;
        }
        this.processing = false;
        resolve(false);
      }
    });
  }
}
