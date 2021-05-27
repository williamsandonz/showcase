import { FormGroup, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { IApiResponse } from '@monorepo/api-client';

export function applyServerErrorsToForm(response: HttpErrorResponse, form: FormGroup) : boolean {
  if (!response.error || response.status !== 400) {
    return false;
  }
  const httpResponse: IApiResponse<null> = response.error;
  const propertyErrors = httpResponse.error.message as any;
  for (const propertyError of propertyErrors) {
    Object.keys(propertyError.constraints).forEach((key) => {
      const message = propertyError.constraints[key];
      propertyError.constraints[key] = {
        message,
        server: true,
      };
    });
    form.get(propertyError.property).setErrors(propertyError.constraints);
  }
  return true;
}

export const regexValidator = (pattern: RegExp, displayName: string) => {
  return (control: FormControl) => {
    return pattern.test(control.value) ? null : { regex: displayName };
  };
};

export const truthyValidator = (displayName: string) => {
  return (control: FormControl) => {
    return !!control.value ? null : { truthy: displayName };
  };
};
