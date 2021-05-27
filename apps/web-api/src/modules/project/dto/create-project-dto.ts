import { ICreateProjectDto } from '@monorepo/web-api-client';
import { IsString, MaxLength } from 'class-validator';

export class CreateProjectDto implements ICreateProjectDto {

  @IsString()
  @MaxLength(100)
  name: string;

}
