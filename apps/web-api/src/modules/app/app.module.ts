import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from '../seed/seed.module';
import { DemoModule } from '../demo/demo.module';
import { AccountModule } from '../account/account.module';
import { CommonModule } from '../common/common.module';
import { PaymentModule } from '../payment/payment.module';
import { getDatabaseConfig } from '../../config';
import { OrganisationModule } from '../organisation/organisation.module';
import { ProjectModule } from '../project/project.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    AccountModule,
    CommonModule,
    DemoModule,
    OrganisationModule,
    PaymentModule,
    ProjectModule,
    SeedModule,
    TypeOrmModule.forRoot(getDatabaseConfig()),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
