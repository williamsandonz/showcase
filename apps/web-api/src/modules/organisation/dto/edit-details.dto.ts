import { IOrganisationEditDetailsRequestDto, validationConstraints, validationMessages } from '@monorepo/web-api-client';
import { IsString, Matches, MaxLength } from 'class-validator';

export class OrganisationEditDetailsRequestDto implements IOrganisationEditDetailsRequestDto {

  @IsString()
  @MaxLength(25)
  name: string;

  @Matches(validationConstraints.slugRegex, {
    message: validationMessages.slug
  })
  slug: string;

}
