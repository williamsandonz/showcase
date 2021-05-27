import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response, Request } from 'express';
import * as Sentry from '@sentry/serverless';
import { IApiResponse } from '@monorepo/api-client';
import { config } from './../../../config';
import { CognitoClaims } from '../providers';
import { DecoratorKeys } from './../decorators';
import { Environments } from '@monorepo/common';

@Catch()
export class ErrorFormatFilter implements ExceptionFilter {

  constructor() {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    console.error(exception); // TODO logger?
    if (config.sentry.dsn) {
      this.logWithSentry(request, exception);
    }
    const isProduction = config.system.environment === Environments.PRODUCTION;
    const except: any =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: !isProduction && exception.name ? exception.name : 'Unknown server error',
            message: !isProduction && exception.message ? exception.message : 'Unknown server error',
          };
    sendErrorResponse(response, request, status, except);
  }

  logWithSentry(request, exception: Error) {
    Sentry.withScope((scope) => {
      try {
        const claims = request.headers[DecoratorKeys.COGNITO_CLAIMS] as CognitoClaims;
        if (claims) {
          // NB: Claims will be defined, so long as IgnoreAuthentication decorator not used.
          scope.setUser({ id: claims.sub });
        }
        Sentry.captureException(exception);
      } catch (e) {
      }
    });
  }

}

export function sendErrorResponse(response: Response, request: Request, status: number, exception: any) {
  response.status(status).json({
    error: {
      message: exception.message,
    },
    system: config.system,
  } as IApiResponse<null>);
}
