import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import * as Sentry from '@sentry/serverless';
import { config } from './../../../config';

@Catch()
export class ErrorFilter implements ExceptionFilter {

  constructor() {}

  catch(exception: Error, host: ArgumentsHost) {
    /*const ctx = host.switchToWs();
    const requestData: DataApiRequest<any> = ctx.getClient();
    const tcpContext = ctx.getData();
    const messagePattern = tcpContext.args[1];
    console.error(`Exception caught in ExceptionFilter from ${messagePattern} with requestData: ${JSON.stringify(requestData)}`);
    console.error(exception);
    if (config.sentry.dsn) {
      this.logWithSentry(requestData, exception);
    }*/
  }
/*
  logWithSentry(requestData: DataApiRequest<any>, exception: Error) {
    Sentry.withScope((scope) => {
      try {
        if (requestData.meta && requestData.meta.authenticatedUser) {
          scope.setUser({ id: requestData.meta.authenticatedUser });
        }
        Sentry.captureException(exception);
      } catch (e) {
        console.error(`Sentry captureException failed with ${e}`);
      }
    });
  }*/

}
