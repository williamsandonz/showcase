import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FieldErrorsDirective } from './directives/field-errors.directive';
import { InvalidOnSubmitErrorStateMatcher } from './';
import { NgxCaptchaModule } from 'ngx-captcha';

const exports = [
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  NgxCaptchaModule,
  ReactiveFormsModule,
];

@NgModule({
  declarations: [FieldErrorsDirective],
  imports: [
    ...exports,
  ],
  exports: [...exports, FieldErrorsDirective],
  providers: [
    {
      provide: ErrorStateMatcher,
      useClass: InvalidOnSubmitErrorStateMatcher,
    },
  ],
})
export class FormModule {}
