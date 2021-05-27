import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationModule } from '../organisation/organisation.module';
import { ProjectModule } from '../project/project.module';
import { StripeModule } from '../stripe/stripe.module';
import { AccountController } from './controllers/account.controller';
import { Account } from './entities/account.entity';
import { AccountService } from './providers/account.service';

@Module({
  controllers: [AccountController],
  exports: [TypeOrmModule, AccountService],
  imports: [OrganisationModule, ProjectModule, StripeModule, TypeOrmModule.forFeature([Account])],
  providers: [AccountService],
})
export class AccountModule {}
