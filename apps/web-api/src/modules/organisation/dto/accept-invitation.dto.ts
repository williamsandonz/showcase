import { IAcceptInvitationRequestDto } from '@monorepo/web-api-client';
import { IsString, MaxLength } from 'class-validator';

export class AcceptInvitationRequestDto implements IAcceptInvitationRequestDto {

  @IsString()
  name: string;

  secret: string;

  @IsString()
  @MaxLength(100)
  timezone: string;

}
