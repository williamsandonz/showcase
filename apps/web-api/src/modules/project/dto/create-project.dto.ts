import { ICreateProjectRequestDto } from '@monorepo/web-api-client';
import { IsString, MaxLength } from 'class-validator';

export class CreateProjectDto implements ICreateProjectRequestDto {

  @IsString()
  @MaxLength(100)
  name: string;

}
