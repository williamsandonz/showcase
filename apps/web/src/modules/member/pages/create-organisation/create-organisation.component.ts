import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IApiResponse } from '@monorepo/api-client';
import { IUserSummaryVm, ICreateProjectRequestDto, IOrganisationMembershipVm, IProjectMembershipVm, validationConstraints, validationMessages } from '@monorepo/web-api-client';
import { Subscription } from 'rxjs';
import { httpRequestFailureMessage } from '../../../shared/common';
import { UserService } from '../../../shared/providers';
import { RoutingService } from '../../../shared/providers/routing.service';
import { applyServerErrorsToFormControls, regexValidator } from './../../../form';

@Component({
  selector: 'app-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss'],
})
export class CreateOrganisationComponent implements OnInit {

  accountSummary: IUserSummaryVm;
  form: FormGroup;
  formError: string;
  processing: boolean;
  subscription1: Subscription;

  constructor(
    public userService: UserService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private routingService: RoutingService,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`Create Organisation`);
    this.form = this.formBuilder.group({
      name: ['', [regexValidator(validationConstraints.urlableRegex, validationMessages.urlable)]],
    });
    this.subscription1 = this.userService.summary$.subscribe((summary: IUserSummaryVm) => {
      this.accountSummary = summary;
    });
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    const formValue = this.form.value;
    this.httpClient
      .post('/organisation', {
        name: formValue.name,
      } as ICreateProjectRequestDto)
      .subscribe(
        async (response: IApiResponse<IOrganisationMembershipVm>) => {
          this.formError = null;
          this.processing = false;
          const membership = response.payload;
          this.userService.summary$.next({
            ...this.accountSummary,
            organisationMemberships:[
              ...this.accountSummary.organisationMemberships.map((membership: IOrganisationMembershipVm) => {
                return {
                  ...membership,
                  selected: false
                }
              }),
              membership
            ]
          });
          this.routingService.goToOrganisationPage('settings/general');
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
