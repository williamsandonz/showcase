import { Injectable } from '@nestjs/common';
import { Demo } from './../entities/';
import { DemoPostRequestDto } from '../dto';
import { DatabaseService } from '../../common/providers';

@Injectable()
export class DemoService {
  constructor(
    private databaseService: DatabaseService,
  ) {}

  get(id: number): Promise<Demo> {
    return this.databaseService.getRepository(Demo).findOne(id);
  }

  save(dto: DemoPostRequestDto): Promise<Demo> {
    return this.databaseService.getRepository(Demo).save({
      foo: dto.foo,
    } as Demo);
  }
}
