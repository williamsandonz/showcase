import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DemoService } from './../providers';
import { IgnoreAuthentication } from '../../common/decorators';
import { MailerService } from '../../common/providers';
import { DemoPostResponseDto, IDemoGetResponseDto, IDemoPostRequestDto } from '../dto';

@Controller('demo')
export class DemoController {
  constructor(private readonly service: DemoService, private mailerService: MailerService) {}

  @Get('detail/:id')
  @IgnoreAuthentication()
  async onGet(
    @Param() params,
  ): Promise<IDemoGetResponseDto> {
    return this.service.get(params.id);
  }

  @Post()
  @IgnoreAuthentication()
  async onPost(@Body() dto: IDemoPostRequestDto): Promise<DemoPostResponseDto> {
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
