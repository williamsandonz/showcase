import { Controller, Post, Body } from '@nestjs/common';
import { DemoService } from './../providers';
import { IgnoreAuthentication } from '../../common/decorators';
import { MailerService } from '../../common/providers';
import { DemoPostRequestDto } from '../dto';
import { IDemoPostResponseDto } from '@monorepo/web-api-client';

@Controller('demo')
export class DemoController {
  constructor(private readonly service: DemoService, private mailerService: MailerService) {}

  @Post()
  @IgnoreAuthentication()
  async onPost(@Body() dto: DemoPostRequestDto): Promise<IDemoPostResponseDto> {
    return this.service.save(dto);
  }

  @Post('send-email')
  @IgnoreAuthentication()
  async onTemp(): Promise<void> {
    await this.mailerService.send(
      {
        to: 'williamsandonz@gmail.com',
        subject: 'This is a Demo email',
      },
      'demo',
      {
        foo: 'bar',
      }
    );
  }

}
