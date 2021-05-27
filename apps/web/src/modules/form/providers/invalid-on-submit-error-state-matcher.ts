import { AbstractControl, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Injectable } from '@angular/core';

@Injectable()
export class InvalidOnSubmitErrorStateMatcher implements ErrorStateMatcher {
  constructor() {}

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return isControlInErrorState(control, form && form.submitted);
  }
}

export function isControlInErrorState(control: AbstractControl, formSubmitted: boolean) {
  const controlTouched = !!(control && (control.dirty || control.touched));
  const controlInvalid = !!(control && control.invalid);
  return (formSubmitted && controlInvalid) || (controlTouched && controlInvalid);
}
