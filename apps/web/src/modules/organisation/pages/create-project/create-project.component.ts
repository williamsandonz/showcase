import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IApiResponse } from '@monorepo/api-client';
import { IUserSummaryVm, ICreateProjectRequestDto, IProjectMembershipVm, validationConstraints, validationMessages } from '@monorepo/web-api-client';
import { Subscription } from 'rxjs';
import { httpRequestFailureMessage } from '../../../shared/common';
import { UserService } from '../../../shared/providers';
import { RoutingService } from '../../../shared/providers/routing.service';
import { applyServerErrorsToFormControls, regexValidator } from './../../../form';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {

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
    this.titleService.setTitle(`Create Project`);
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
      .post('/project', {
        name: formValue.name,
      } as ICreateProjectRequestDto)
      .subscribe(
        async (response: IApiResponse<IProjectMembershipVm>) => {
          this.formError = null;
          this.processing = false;
          const membership = response.payload;
          this.userService.summary$.next({
            ...this.accountSummary,
            projectMemberships:[
              ...this.accountSummary.projectMemberships,
              membership
            ]
          });
          this.routingService.goToProjectPage(membership.project, 'settings/general');
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
