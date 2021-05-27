import { IDemoPostResponseDto } from '@monorepo/web-api-client';

export class DemoPostResponseDto implements IDemoPostResponseDto {
  id: number;
  foo: string;
}
