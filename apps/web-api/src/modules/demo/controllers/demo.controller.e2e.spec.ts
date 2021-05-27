import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DemoModule } from './../demo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { assert } from 'console';
import { getDatabaseConfigForE2E, seedGlobal } from './../../../test';
import { IApiResponse } from '@monorepo/api-client';
import { DemoPostResponseDto, IDemoGetResponseDto } from '../dto';
import { DemoService } from '../providers';

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
        const response = rawResponse.body as IApiResponse<DemoPostResponseDto>;
        assert(response.payload.foo, 'bar-post');
      });
  });
  it('/ (GET)', async () => {
    expect.assertions(1);
    await service.save({
      foo: 'bar-get'
    });
    return request(app.getHttpServer())
      .get('/demo/detail/1')
      .expect(200)
      .then((rawResponse: request.Response) => {
        const response = rawResponse.body as IApiResponse<IDemoGetResponseDto>;
        expect(response.payload.foo).toEqual('bar-get');
      });
  });
  afterEach(async () => {
    await app.close();
  });
});
