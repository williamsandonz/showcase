import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Demo } from './../entities/';
import { Repository } from 'typeorm';
import { IDemoPostRequestDto } from '../dto';

@Injectable()
export class DemoService {
  constructor(
    @InjectRepository(Demo)
    public repo: Repository<Demo>
  ) {}

  get(id: number): Promise<Demo> {
    return this.repo.findOne(id);
  }

  save(dto: IDemoPostRequestDto): Promise<Demo> {
    return this.repo.save({
      foo: dto.foo,
    } as Demo);
  }
}
