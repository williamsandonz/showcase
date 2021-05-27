import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FieldErrorsDirective } from './directives/field-errors.directive';
import { InvalidOnSubmitErrorStateMatcher } from './';

const exportedModules = [MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule];

@NgModule({
  declarations: [FieldErrorsDirective],
  imports: [...exportedModules],
  exports: [...exportedModules, FieldErrorsDirective],
  providers: [
    {
      provide: ErrorStateMatcher,
      useClass: InvalidOnSubmitErrorStateMatcher,
    },
  ],
})
export class FormModule {}
