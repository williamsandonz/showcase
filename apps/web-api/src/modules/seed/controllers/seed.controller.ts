import { Controller, Post, Delete} from '@nestjs/common';
import { SeedService } from './../providers';
import { IgnoreAuthentication } from '../../common/decorators';

@Controller('seed')
export class SeedController {
  constructor(private service: SeedService) {}

  @Post()
  @IgnoreAuthentication()
  async onCreate(): Promise<void> {
    await this.service.createData();
  }

  @Delete()
  async onDelete(): Promise<any> {
    return this.service.deleteData();
  }

}
