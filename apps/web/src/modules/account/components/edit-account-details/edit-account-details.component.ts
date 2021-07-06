import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { applyServerErrorsToFormControls } from './../../../form';
import { Router } from '@angular/router';
import { UserService, CognitoService, UtilityService } from './../../../shared/providers';
import { IApiResponse } from '@monorepo/api-client';
import { Subscription } from 'rxjs';
import { IUserEditDetailsRequestDto, IUserSummaryVm } from '@monorepo/web-api-client';
import { httpRequestFailureMessage, successMessageDisplayDuration } from '../../../shared/common';

@Component({
  selector: 'app-edit-account-details',
  templateUrl: './edit-account-details.component.html',
  styleUrls: ['./edit-account-details.component.scss'],
})
export class EditAccountDetailsComponent implements OnInit, OnDestroy {

  accountSummary: IUserSummaryVm;
  form: FormGroup;
  formError: string;
  passwordValueChanges$: any;
  processing: boolean;
  @Output() saved = new EventEmitter<void>();
  success = false;
  submitted = false;
  subscription1: Subscription;
  timezoneOptions: string[];

  constructor(
    public userService: UserService,
    public cognitoService: CognitoService,
    public httpClient: HttpClient,
    public formBuilder: FormBuilder,
    public router: Router,
    public utilityService: UtilityService,
  ) {}

  ngOnInit() {
    this.timezoneOptions = this.utilityService.getTimezones();
    this.subscription1 = this.userService.summary$.subscribe((summary: IUserSummaryVm) => {
      this.accountSummary = summary;
      if (this.form) {
        return;
      }
      this.form = this.formBuilder.group({
        name: [summary.name, [Validators.required]],
        timezone: [summary.timezone, [Validators.required]]
      });
    });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    const formValue = this.form.value;
    this.httpClient
      .post('/user/edit-details', {
        name: formValue.name,
        timezone: formValue.timezone
      } as IUserEditDetailsRequestDto)
      .subscribe(
        async (response: IApiResponse<void>) => {
          this.formError = null;
          this.processing = false;
          this.userService.summary$.next({
            ...this.accountSummary,
            name: formValue.name,
            timezone: formValue.timezone,
          });
          this.success = true;
          setTimeout(() => {
            this.saved.emit();
            // Inelegant but rather than needing downstream components to subscribe to accountSummary changes
            // and then reformat dates in local time when timezone changed, it's simpler to just refresh page.
            window.location.reload();
          }, successMessageDisplayDuration);
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
