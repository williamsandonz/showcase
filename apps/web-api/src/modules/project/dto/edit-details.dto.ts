import { IProjectEditDetailsRequestDto, validationConstraints, validationMessages } from '@monorepo/web-api-client';
import { IsNumber, IsString, Matches, MaxLength } from 'class-validator';

export class ProjectEditDetailsRequestDto implements IProjectEditDetailsRequestDto {

  @IsNumber()
  id: number;

  @IsString()
  @MaxLength(25)
  name: string;

  @Matches(validationConstraints.slugRegex, {
    message: validationMessages.slug
  })
  slug: string;

}
