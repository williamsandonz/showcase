import { IUserEditDetailsRequestDto } from '@monorepo/web-api-client';
import { IsString, MaxLength } from 'class-validator';

export class UserEditDetailsRequestDto implements IUserEditDetailsRequestDto {

  @IsString()
  @MaxLength(25)
  name: string;

  @IsString()
  timezone: string;

}
