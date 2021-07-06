import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IApiResponse } from '@monorepo/api-client';
import { IUserSummaryVm, IOrganisationEditDetailsRequestDto, validationConstraints, validationMessages } from '@monorepo/web-api-client';
import { first } from 'rxjs/operators';
import { applyServerErrorsToFormControls, regexValidator } from '../../../form';
import { httpRequestFailureMessage, successMessageDisplayDuration } from '../../../shared/common';
import { UserService } from '../../../shared/providers';
import { RoutingService } from '../../../shared/providers/routing.service';

@Component({
  selector: 'app-edit-organisation-details',
  templateUrl: './edit-organisation-details.component.html',
  styleUrls: ['./edit-organisation-details.component.scss'],
})
export class EditOrganisationDetailsComponent implements OnInit {

  accountSummary: IUserSummaryVm;
  form: FormGroup;
  formError: string;
  passwordValueChanges$: any;
  processing: boolean;
  @Output() saved = new EventEmitter<void>();
  submitted = false;
  success = false;
  timezoneOptions: string[];

  constructor(
    public userService: UserService,
    public httpClient: HttpClient,
    public formBuilder: FormBuilder,
    public routingService: RoutingService,
  ) {}

  ngOnInit() {
    this.userService.summary$.pipe(first()).subscribe((summary: IUserSummaryVm) => {
      this.accountSummary = summary;
      const organisation = summary.organisationMemberships.find(m => m.selected).organisation;
      this.form = this.formBuilder.group({
        name: [organisation.name, [Validators.required]],
        slug: [organisation.slug, [regexValidator(validationConstraints.urlableRegex, validationMessages.urlable)]],
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
      .post('/organisation/edit-details', {
        name: formValue.name,
        slug: formValue.slug,
      } as IOrganisationEditDetailsRequestDto)
      .subscribe(
        async (response: IApiResponse<void>) => {
          this.processing = false;
          const selectedOrganisation = this.accountSummary.organisationMemberships
            .find(m => m.selected).organisation;
          selectedOrganisation.name = formValue.name;
          selectedOrganisation.slug = formValue.slug;
          this.success = true;
          setTimeout(async () => {
            // Route using window.location rather than NG router as want full page refersh so don't need
            // to worry about outdated links using old slug
            window.location.href = await this.routingService.getPagePathForOrganisation('settings/general');
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
