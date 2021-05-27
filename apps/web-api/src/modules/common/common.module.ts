import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { ErrorFormatFilter } from './filters';
import { AuthenticationGuard } from './guards';
import { ResponseInterceptor } from './interceptors';
import { ValidationResponseFormatterPipe } from './pipes';
import { CognitoService, MailerService } from './providers';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFormatFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useFactory: (cognitoService: CognitoService) => {
        // useFactory instead of useClass because otherwise reflector not injected properly
        return new AuthenticationGuard(cognitoService, new Reflector());
      },
      inject: [CognitoService],
    },
    {
      provide: APP_PIPE,
      useClass: ValidationResponseFormatterPipe,
    },
    CognitoService,
    MailerService,
  ],
  imports: [],
  exports: [CognitoService, MailerService],
})
export class CommonModule {}
