import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IApiResponse } from '@monorepo/api-client';
import { IUserSummaryVm, IProjectEditDetailsRequestDto, IProjectMembershipVm, validationConstraints, validationMessages } from '@monorepo/web-api-client';
import { first } from 'rxjs/operators';
import { applyServerErrorsToFormControls, regexValidator } from '../../../form';
import { httpRequestFailureMessage, successMessageDisplayDuration } from '../../../shared/common';
import { UserService } from '../../../shared/providers';
import { RoutingService } from '../../../shared/providers/routing.service';

@Component({
  selector: 'app-edit-project-details',
  templateUrl: './edit-project-details.component.html',
  styleUrls: ['./edit-project-details.component.scss'],
})
export class EditProjectDetailsComponent implements OnInit {

  accountSummary: IUserSummaryVm;
  form: FormGroup;
  formError: string;
  processing: boolean;
  projectId: number;
  @Output() saved = new EventEmitter<void>();
  submitted = false;
  success = false;

  constructor(
    public userService: UserService,
    public httpClient: HttpClient,
    public formBuilder: FormBuilder,
    public router: Router,
    public routingService: RoutingService,
  ) {}

  ngOnInit() {
    this.userService.summary$.pipe(first()).subscribe(async (summary: IUserSummaryVm) => {
      this.accountSummary = summary;
      const project = (await this.routingService.getCurrentProjectMembership()).project;
      this.projectId = project.id;
      this.form = this.formBuilder.group({
        name: [project.name, [Validators.required]],
        slug: [project.slug, [regexValidator(validationConstraints.urlableRegex, validationMessages.urlable)]],
      });
    });
  }

  async onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.processing = true;
    this.formError = null;
    const formValue = this.form.value;
    this.httpClient
      .post('/project/edit-details', {
        id: this.projectId,
        name: formValue.name,
        slug: formValue.slug,
      } as IProjectEditDetailsRequestDto)
      .subscribe(
        async (response: IApiResponse<void>) => {
          this.processing = false;
          this.success = true;
          let project = this.accountSummary.projectMemberships.find(m => m.project.id === this.projectId).project;
          project = {
            ...project,
            name: formValue.name,
            slug: formValue.slug
          };
          this.userService.summary$.next({
            ...this.accountSummary,
            projectMemberships: this.accountSummary.projectMemberships.map((membership: IProjectMembershipVm) => {
              if(membership.project.id === this.projectId) {
                membership.project = project;
              }
              return membership;
            })
          });
          setTimeout(async() => {
            window.location.href = await this.routingService.getPagePathForProject(project, 'settings/general');
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
