import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { CommonModule } from '../common/common.module';
import { OrganisationModule } from '../organisation/organisation.module';
import { ProjectModule } from '../project/project.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './providers/user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [AccountModule, CommonModule, OrganisationModule, ProjectModule],
  providers: [UserService],
})
export class UserModule {}
