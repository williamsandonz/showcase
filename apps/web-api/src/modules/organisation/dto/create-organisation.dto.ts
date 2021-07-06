import { ICreateOrganisationRequestDto } from '@monorepo/web-api-client';
import { IsString, MaxLength } from 'class-validator';

export class CreateOrganisationDto implements ICreateOrganisationRequestDto {

  @IsString()
  @MaxLength(100)
  name: string;

}
