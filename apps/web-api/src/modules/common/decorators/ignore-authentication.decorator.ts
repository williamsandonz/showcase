import { SetMetadata } from '@nestjs/common';
import { DecoratorKeys } from './keys';

export const IgnoreAuthentication = () => SetMetadata(DecoratorKeys.IGNORE_AUTH, true);
