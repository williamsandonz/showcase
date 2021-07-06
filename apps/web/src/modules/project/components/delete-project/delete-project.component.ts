import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService, CognitoService } from '../../../shared/providers';
import { regexValidator } from './../../../form';
import { IApiResponse } from '@monorepo/api-client';
import { Router } from '@angular/router';
import { httpRequestFailureMessage } from '../../../shared/common';
import { RoutingService } from '../../../shared/providers/routing.service';
import { IUserSummaryVm, IProjectVm, IProjectMembershipVm } from '@monorepo/web-api-client';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss'],
})
export class DeleteProjectComponent implements OnInit {

  accountSummary: IUserSummaryVm;
  form: FormGroup;
  formError: string;
  processing: boolean;
  @Input() project: IProjectVm;

  constructor(
    public userService: UserService,
    public cognitoService: CognitoService,
    public formBuilder: FormBuilder,
    public httpClient: HttpClient,
    public router: Router,
    public routingService: RoutingService,
  ) {}

  ngOnInit() {
    this.userService.summary$.pipe(first()).subscribe((summary: IUserSummaryVm) => {
      this.accountSummary = summary;
    });
    this.form = this.formBuilder.group({
      confirmation: ['', [regexValidator(/delete/i, 'Must be "delete"')]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.formError = null;
    this.processing = true;
    this.httpClient.delete(`/project?id=${this.project.id}`).subscribe(
      async (response: IApiResponse<any>) => {
        this.userService.summary$.next({
          ...this.accountSummary,
          projectMemberships: this.accountSummary.projectMemberships.filter((membership: IProjectMembershipVm) => {
            return membership.project.id !== this.project.id;
          })
        });
        await this.routingService.goToOrganisationPage('projects');
      },
      async (response: HttpErrorResponse) => {
        this.processing = false;
        this.formError = httpRequestFailureMessage;
      }
    );
  }

}
