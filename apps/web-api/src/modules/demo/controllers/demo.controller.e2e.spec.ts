import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DemoModule } from './../demo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assert } from 'console';
import { getDatabaseConfigForE2E, seedGlobal } from './../../../test';
import { IApiResponse } from '@monorepo/api-client';
import { DemoService } from '../providers';
import { IDemoPostResponseDto } from '@monorepo/web-api-client';

describe('DemoController (e2e)', () => {
  let app: INestApplication;
  let service: DemoService;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DemoModule, TypeOrmModule.forRoot(getDatabaseConfigForE2E())],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    service = app.get(DemoService);
    await seedGlobal(app);
  });
  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/demo')
      .send({ foo: 'bar-post' })
      .expect(201)
      .then((rawResponse: request.Response) => {
        const response = rawResponse.body as IApiResponse<IDemoPostResponseDto>;
        assert(response.payload.foo, 'bar-post');
      });
  });
  afterEach(async () => {
    await app.close();
  });
});
