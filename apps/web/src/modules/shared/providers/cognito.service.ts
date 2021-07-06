import { Injectable } from '@angular/core';
import awsAmplify, { Auth, Hub } from 'aws-amplify';
import { CognitoUser, CognitoHostedUIIdentityProvider } from '@aws-amplify/auth';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { SignOutOpts } from '@aws-amplify/auth/lib-esm/types';
import { HubCapsule } from '@aws-amplify/core';
import { regexValidator } from '../../form';
import { Environments } from '@monorepo/common';
import { UserService } from './user.service';
const { promisify } = require('es6-promisify');

export const cognitoPasswordValidator = [
  // https://stackoverflow.com/questions/58767980/aws-cognito-password-regex-specific-to-aws-cognito
  regexValidator(/^\S{6,99}$/, 'Must contain no spaces and be at least 6 character long.'),
];

@Injectable()
export class CognitoService {

  authenticatedHookDisabled = false;
  public authenticatedUser: CognitoUser;
  authenticatedUser$ = new ReplaySubject<CognitoUser>(1);

  constructor(public userService: UserService, public router: Router) {}

  async onAppInit(): Promise<void> {
    this.authenticatedUser$.subscribe((user) => (this.authenticatedUser = user));
    awsAmplify.configure({
      Auth: {
        oauth: {
          domain: `${environment.cognito.oAuth.domain}`,
          redirectSignIn: `${window.location.origin}${environment.cognito.oAuth.callbackLogin}`,
          redirectSignOut: `${window.location.origin}${environment.cognito.oAuth.callbackLogout}`,
          responseType: 'code',
          scope: environment.cognito.oAuth.scopes,
        },
        region: environment.cognito.region,
        userPoolId: environment.cognito.poolId,
        userPoolWebClientId: environment.cognito.clientId,
        mandatorySignIn: false,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
      },
    });

    Hub.listen('auth', (capsule: HubCapsule) => {
      const event = capsule.payload.event.toLowerCase();
      if (event !== 'signin') {
        return;
      }
      const cognitoUser: CognitoUser = capsule.payload.data;
      if (cognitoUser.getSignInUserSession().getIdToken().payload.name) {
        // Implicitly deduce it was a fedearation sign in (Bit dodgey).
        // Defer calling onAuthenticationStateChange
        return;
      }
      this.onAuthenticationStateChange(capsule.payload.data);
    });
    if (window.location.pathname === environment.cognito.oAuth.callbackLogin) {
      // Don't want to refresh session if user is still completing sign up
      return;
    }
    await this.refreshSession();
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<'SUCCESS'> {
    return Auth.changePassword(this.authenticatedUser, currentPassword, newPassword);
  }

  async forgotPassword(username): Promise<any> {
    return Auth.forgotPassword(username);
  }

  async onAuthenticationStateChange(cognitoUser: CognitoUser = null): Promise<void> {
    this.authenticatedUser$.next(cognitoUser);
    if (cognitoUser) {
      if (environment.system.environment !== Environments.PRODUCTION) {
        console.log(cognitoUser.getSignInUserSession().getAccessToken().getJwtToken());
      }
      if (!this.authenticatedHookDisabled) {
        await this.userService.onAuthenticated();
      }
    }
  }

  private async refreshAuthenticatedUser(): Promise<void> {
    let cognitoUser = await this.currentAuthenticatedUser(true);
    if (cognitoUser) {
      this.authenticatedUser$.next(cognitoUser);
    }
  }

  async currentAuthenticatedUser(forceLoginOnFailure: boolean = false): Promise<CognitoUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        resolve(cognitoUser);
      } catch (e) {
        if (forceLoginOnFailure) {
          this.router.navigate(['/login']);
        }
        // Fail silently
        resolve(null);
      }
    });
  }

  async delete(): Promise<any> {
    const cognitoUser = await this.currentAuthenticatedUser(true);
    return new Promise(async (resolve, reject) => {
      cognitoUser.deleteUser((error, data) => {
        if (error) {
          return reject(error);
        }
        resolve(data);
      });
    });
  }

  async federatedSignIn(provider: CognitoHostedUIIdentityProvider): Promise<any> {
    return Auth.federatedSignIn({
      provider,
    });
  }

  async refreshSession(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let cognitoUser = await this.currentAuthenticatedUser();
      if (!cognitoUser) {
        this.onAuthenticationStateChange();
        return resolve(false);
      }
      try {
        const currentSession = cognitoUser.getSignInUserSession();
        const refreshToken = currentSession.getRefreshToken();
        await promisify(cognitoUser.refreshSession.bind(cognitoUser))(currentSession.getRefreshToken());
        this.onAuthenticationStateChange(cognitoUser);
        resolve(true);
      } catch (e) {
        this.onAuthenticationStateChange();
        // User was logged in previously so we can safely assume they'd like to log in
        // again, therefore redirect them to login page...
        this.router.navigate(['/login']);
        reject(e);
      }
    });
  }

  async resetPassword(username: string, code: string, newPassword: string): Promise<any> {
    return Auth.forgotPasswordSubmit(username, code, newPassword);
  }

  async signIn(username, password): Promise<CognitoUser> {
    return new Promise(async (resolve, reject) => {
      try {
        const user: CognitoUser = await Auth.signIn(username, password);
        resolve(user);
      } catch (e) {
        reject(e);
      }
    });
  }

  async signUp(email, password): Promise<CognitoUser> {
    return new Promise(async (resolve, reject) => {
      // Defer loading account summary until user exists in our DB
      this.authenticatedHookDisabled = true;
      // It's counter-intutive to try signIn first but becuase it's possible for Cognito sign up to succeed
      // and the internal API call to fail afterwards,
      // subsequent attempts will hit a dead end because Cognito sign up will result in a user already exists exception.
      this.signIn(email, password)
        .then((user: CognitoUser) => {
          // User already exists in Cognito
          resolve(user);
        })
        .catch(async (e) => {
          if (e.code === 'NotAuthorizedException') {
            // User already exists in Cognito but password was wrong
            return reject(e);
          } else if (e.code === 'UserNotFoundException') {
            // User doesn't exist in Cognito yet so create it.
            try {
              await Auth.signUp({
                username: email,
                password,
                attributes: {
                  email,
                },
              });
              // Return null becuase caller will still need to call .signIn afterwards
              // because Auth.signUp does not init a session.
              resolve(null);
            } catch(e) {
              reject(e);
            }
          } else {
            throw new Error('Unhandled condition in signUp for error ' + e);
          }
        });
    });
  }

  async signOut(options: SignOutOpts = {}): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await Auth.signOut(options);
        this.onAuthenticationStateChange();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async updateUserAttributes(attributes: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await Auth.updateUserAttributes(this.authenticatedUser, attributes);
        await this.refreshAuthenticatedUser();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async verifyUserAttribute(attribute: string): Promise<void> {
    return Auth.verifyUserAttribute(this.authenticatedUser, attribute);
  }

  async verifyUserAttributeSubmit(attribute: string, code: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await Auth.verifyUserAttributeSubmit(this.authenticatedUser, attribute, code);
        await this.refreshAuthenticatedUser();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async userAttributes(): Promise<CognitoUserAttribute[]> {
    return Auth.userAttributes(this.authenticatedUser);
  }
}
