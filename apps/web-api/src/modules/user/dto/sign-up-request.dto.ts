import { ISignUpRequestDto, validationMessages } from '@monorepo/web-api-client';
import { IsString, Matches, MaxLength, Validate } from 'class-validator';
import { validationConstraints } from '@monorepo/web-api-client';
import { UniqueByPropertyValidator } from '../../common/validators';
import { Account } from '../../account/entities';

export class SignUpRequestDto implements ISignUpRequestDto {

  @IsString()
  id: string;

  @IsString()
  @Validate(UniqueByPropertyValidator, [
    Account,
    'email',
  ], {
    message: () => {
      return 'An account by this email already exists.';
    }
  })
  email: string;

  @IsString()
  @MaxLength(25)
  name: string;

  @IsString()
  @Matches(validationConstraints.urlableRegex, {
    message: validationMessages.urlable
  })
  organisation: string;

  @IsString()
  @MaxLength(100)
  timezone: string;

}
