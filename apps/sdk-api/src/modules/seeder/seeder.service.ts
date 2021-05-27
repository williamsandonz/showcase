import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Demo } from './../demo/entities/demo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Demo)
    private demoRepo: Repository<Demo>
  ) {}

  async run() {
    await this.demoRepo.insert({
      foo: 'bar',
    } as Demo);
  }
}
