import { ISignUpRequestDto } from '@monorepo/web-api-client';
import { IsString, MaxLength } from 'class-validator';

export class SignUpRequestDto implements ISignUpRequestDto {
  @IsString()
  id: string;

  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  @MaxLength(50)
  organisation: string;
}
