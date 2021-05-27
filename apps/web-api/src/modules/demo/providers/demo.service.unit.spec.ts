import { Test, TestingModule } from '@nestjs/testing';
import { DemoController } from './../controllers/demo.controller';
import { DemoService } from './demo.service';
import { Repository } from 'typeorm';
import { Demo } from './../entities/demo.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailerService } from '../../common/providers';

describe('DemoController', () => {

  let service: DemoService;
  let repo: Repository<Demo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemoController],
      providers: [
        DemoService,
        MailerService,
        {
          provide: getRepositoryToken(Demo),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<DemoService>(DemoService);
    repo = module.get<Repository<Demo>>(getRepositoryToken(Demo));
  });

  it('should get one demo entity', async () => {
    const demo: Demo = {
      id: 1,
      foo: 'bar',
    };
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(demo);
    expect(await service.get(1)).toEqual(demo);
  });

});
