import { Directive, ElementRef, Input, DoCheck } from '@angular/core';
import { FormControl } from '@angular/forms';
import { isControlInErrorState } from '../';

@Directive({
  selector: '[appFieldErrors]',
})
export class FieldErrorsDirective implements DoCheck {
  @Input('appFieldErrors') control: FormControl;
  @Input() defaultColor: string;
  @Input() formSubmitted: boolean;

  constructor(public element: ElementRef) {}

  ngDoCheck() {
    this.element.nativeElement.innerHTML = '';
    if (typeof this.formSubmitted !== 'undefined' && !isControlInErrorState(this.control, this.formSubmitted)) {
      // When this directive is used with <mat-checkbox> or <mat-radio> we can assume that formSubmitted is supplied.
      // In this scenario, if the control is valid, we manually remove the error message displayed.
      // This weirdness is necessary because <mat-checkbox> and <mat-radio> can't be placed inside <mat-form-field>
      // They cannot automatically benefit from ErrorStateMatcher. (Which updates control validity when form submitted)
      // So this will cause message to always be displayed even before form submitted.
      return;
    }
    const errors = Object.keys(this.control.errors || {});
    if (errors.length) {
      // Only display the first error because mat-form-field only contains enough height for a 1 line message
      const key = errors[0];
      const value = this.control.errors[key];
      const isServerError = value && !!value.server;
      if (!isServerError && !messageMap[key]) {
        throw new Error(`Validation map does not contain entry for key ${key}`);
      }
      this.element.nativeElement.innerHTML = (isServerError ? value.message : messageMap[key](value));
    }
  }
}

const messageMap = {
  maxlength: (value) => {
    return `Cannot exceed ${value.requiredLength} characters`;
  },
  minlength: (value) => {
    return `Must be at least ${value.requiredLength} characters`;
  },
  matchesOther: (value) => {
    return `${value}`;
  },
  remote: (value) => {
    return value;
  },
  regex: (value) => {
    return value;
  },
  required: () => {
    return `Please enter a value`;
  },
  truthy: (value) => {
    return `${value}`;
  },
  unique: (value) => {
    return `${value}`;
  },
};
