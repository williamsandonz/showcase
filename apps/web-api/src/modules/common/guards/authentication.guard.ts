import { Injectable, CanActivate, ExecutionContext, Inject, UnauthorizedException } from '@nestjs/common';
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
          return resolve(false);
        });
    });
  }

}
