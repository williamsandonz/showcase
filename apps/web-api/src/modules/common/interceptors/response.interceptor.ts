import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { config } from './../../../config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiResponse } from '@monorepo/api-client';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
    return next.handle().pipe(
      map((payload: T) => {
        return {
          payload,
          system: config.system,
        } as IApiResponse<T>;
      })
    );
  }
}
