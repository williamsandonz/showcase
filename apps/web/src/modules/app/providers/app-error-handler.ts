import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SentryService } from '../../shared/providers';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(public sentryService: SentryService) {}

  handleError(error: Error): void {
    console.error(error);
    if (environment.exceptions.sentryDsn) {
      this.sentryService.capture(error);
    }
  }
}
