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
    if (typeof this.formSubmitted !== 'undefined' && !isControlInErrorState(this.control, this.formSubmitted)) {
      // Because <mat-checkbox> and <mat-radio> can't be placed inside <mat-form-field>
      // They cannot automatically benefit from ErrorStateMatcher and therefore will
      // always be visible. So we use this guard to connect it to the logic of our state
      // matcher.
      return;
    }
    this.element.nativeElement.innerHTML = '';
    const errors = Object.keys(this.control.errors || {});
    errors.forEach((key, i) => {
      const value = this.control.errors[key];
      const isServerError = value && !!value.server;
      if (!isServerError && !messageMap[key]) {
        throw new Error(`Validation map does not contain entry for key ${key}`);
      }
      const conjunction = i !== 0 ? '<br />' : '';
      this.element.nativeElement.innerHTML += conjunction + (isServerError ? value.message : messageMap[key](value));
    });
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
