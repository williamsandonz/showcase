import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import * as Axios from 'axios';
import * as jsonwebtoken from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';
import { config } from './../../../config';

@Injectable()
export class CognitoService {
  cachedPublicKeys: CognitoMapOfKidToPublicKey | undefined;
  verifyTokenAsPromise = promisify(jsonwebtoken.verify.bind(jsonwebtoken));
  uri: string;

  constructor() {
    const uri = `https://cognito-idp.${config.aws.region}.amazonaws.com/`;
    this.uri = `${uri}${config.aws.cognito.poolId}`;
  }

  private async fetchPublicKeys(): Promise<CognitoMapOfKidToPublicKey> {
    return new Promise((resolve, reject) => {
      if (this.cachedPublicKeys) {
        resolve(this.cachedPublicKeys);
        return;
      }
      Axios.default
        .get<PublicKeys>(`${this.uri}/.well-known/jwks.json`)
        .then((publicKeys) => {
          this.cachedPublicKeys = publicKeys.data.keys.reduce((agg, current) => {
            return {
              ...agg,
              [current.kid]: {
                instance: current,
                pem: jwkToPem(current),
              },
            };
          }, {} as CognitoMapOfKidToPublicKey);
          resolve(this.cachedPublicKeys);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  async validateToken(request: CognitoClaimVerifyRequest): Promise<CognitoClaims> {
    return new Promise(async (resolve, reject) => {
      try {
        const tokenSections = (request.token || '').split('.');
        if (tokenSections.length < 2) {
          reject('Invalid token format');
          return;
        }
        const header = JSON.parse(Buffer.from(tokenSections[0], 'base64').toString('utf8')) as CognitoTokenHeader;
        const publicKeys = await this.fetchPublicKeys();
        const key = publicKeys[header.kid];
        if (key === undefined) {
          reject('claim made for unknown kid');
          return;
        }
        const claims = (await this.verifyTokenAsPromise(request.token, key.pem)) as CognitoClaims;
        const currentSeconds = Math.floor(new Date().valueOf() / 1000);
        // Adjusting current time to account for small system time differences between us and AWS Cognito
        // because sometimes their clock is slightly ahead of ours causing this conditional to fire.
        const adjustedCurrentSeconds = currentSeconds + 300;
        if (currentSeconds > claims.exp || adjustedCurrentSeconds < claims.auth_time) {
          reject('claim is expired or invalid');
          return;
        }
        if (this.uri !== claims.iss) {
          reject('claim issuer is invalid');
          return;
        }
        if (claims.token_use !== 'access') {
          reject('claim use is not access');
          return;
        }
        resolve(claims);
      } catch (e) {
        reject(e.toString());
        return;
      }
    });
  }
}

interface CognitoClaimVerifyRequest {
  readonly token?: string;
}

interface CognitoTokenHeader {
  kid: string;
  alg: string;
}

interface CognitoPublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

interface CognitoPublicKeyMeta {
  instance: CognitoPublicKey;
  pem: string;
}

interface PublicKeys {
  keys: CognitoPublicKey[];
}

interface CognitoMapOfKidToPublicKey {
  [key: string]: CognitoPublicKeyMeta;
}

export interface CognitoClaims {
  sub: string;
  event_id: string;
  token_use: string;
  scope: string;
  auth_time: number;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
  client_id: string;
  username: string;
}
