import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { IApiResponse } from '@monorepo/api-client';
import { constants, ICreateProjectDto } from '@monorepo/web-api-client';
import { applyServerErrorsToForm } from './../../../form';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateProjectComponent implements OnInit {

  form: FormGroup;
  processing: boolean;
  unexpectedRequestError: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.titleService.setTitle(`${constants.appName} - Create Project`);
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
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
      } as ICreateProjectDto)
      .subscribe(
        async (response: IApiResponse<any>) => {
          this.unexpectedRequestError = false;
          this.processing = false;
          // TODO navigate this.router.navigate(['/members/projects']);
        },
        (response: HttpErrorResponse) => {
          this.processing = false;
          if(!applyServerErrorsToForm(response, this.form)) {
            this.unexpectedRequestError = true;
          }
        }
      );
  }

}
