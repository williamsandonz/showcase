import { Headers } from '@nestjs/common';
import { DecoratorKeys } from './keys';

export function CognitoClaims(): ParameterDecorator {
  return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
    return Headers(DecoratorKeys.COGNITO_CLAIMS)(target, propertyKey, parameterIndex);
  };
}
