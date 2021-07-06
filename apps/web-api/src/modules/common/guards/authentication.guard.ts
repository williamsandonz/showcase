import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpException } from '@nestjs/common';
import { CognitoService, CognitoClaims } from './../providers';
import { Reflector } from '@nestjs/core';
import { DecoratorKeys } from '../decorators';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private cognitoService: CognitoService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const argumentsHosts = context.switchToHttp();
    const request = argumentsHosts.getRequest();
    return new Promise((resolve, reject) => {
      if (this.reflector.get<string[]>(DecoratorKeys.IGNORE_AUTH, context.getHandler())) {
        return resolve(true);
      }
      const bearerToken = request.get('Authorization');
      if (!bearerToken) {
        // User has attempted to access a protected endpoint without credentials
        // Not a viable path unless user is malicious
        return resolve(false);
      }
      this.cognitoService
        .validateToken({
          token: bearerToken.replace('Bearer ', ''),
        })
        .then((claims: CognitoClaims) => {
          request.headers[DecoratorKeys.COGNITO_CLAIMS] = claims;
          return resolve(true);
        })
        .catch((e) => {
          // Token exists but not valid, most likely scenario is it has expired.
          this.deny();
        });
    });
  }

  deny() {
    throw new HttpException('', 498);
  }

}
