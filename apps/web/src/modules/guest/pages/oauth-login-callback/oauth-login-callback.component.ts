import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CognitoUser } from '@aws-amplify/auth';
import { ISignUpRequestDto, constants } from '@monorepo/web-api-client';
import { IApiResponse } from '@monorepo/api-client';
import { CognitoService } from '../../../shared/providers';
import { applyServerErrorsToForm } from '../../../form';

@Component({
  selector: 'app-oauth-login-callback',
  templateUrl: './oauth-login-callback.component.html',
  styleUrls: ['./oauth-login-callback.component.scss'],
})
export class OAuthLoginCallbackComponent {
  cognitoUser: CognitoUser;
  error = false;
  form: FormGroup;
  loading = true;
  processing = false;
  title = 'Loading';

  constructor(
    public cognitoService: CognitoService,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public router: Router,
    public titleService: Title
  ) {}

  async ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Sign up`);
    this.cognitoUser = await this.cognitoService.currentAuthenticatedUser(true);
    this.httpClient.get(`/account/has-signed-up/${this.cognitoUser['attributes']['sub']}`).subscribe(
      (response: IApiResponse<boolean>) => {
        const accountExists = response.payload;
        if (accountExists) {
          return this.setAsAuthenticatedAndRedirect();
        }
        this.loading = false;
        this.title = 'Finish sign up';
        this.initForm(this.cognitoUser.getSignInUserSession().getIdToken().payload);
      },
      (response: HttpErrorResponse) => {
        this.loading = false;
        this.title = 'Oh dear!';
        this.error = true;
      }
    );
  }

  initForm(idTokenPayload: any) {
    this.form = this.formBuilder.group({
      name: [idTokenPayload.name || '', [Validators.required]],
      organisation: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    const formValue = this.form.value;
    this.httpClient
      .post('/account/sign-up', {
        id: this.cognitoUser['attributes']['sub'],
        name: formValue.name,
        organisation: formValue.organisation,
      } as ISignUpRequestDto)
      .subscribe(
        (response: IApiResponse<any>) => {
          this.setAsAuthenticatedAndRedirect();
        },
        (response: HttpErrorResponse) => {
          this.processing = false;
          applyServerErrorsToForm(response, this.form);
        }
      );
  }

  setAsAuthenticatedAndRedirect() {
    this.cognitoService.onAuthenticationStateChange(this.cognitoUser);
    this.router.navigate(['/members/projects']);
  }
}
