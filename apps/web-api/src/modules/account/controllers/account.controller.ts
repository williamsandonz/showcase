import { Controller, Post, Body, Get, Delete, Param, Query } from '@nestjs/common';
import { AccountService } from './../providers';
import { SignUpRequestDto } from './../dto';
import { CognitoClaims, IgnoreAuthentication } from '../../common/decorators';
import { IAccountAuthenticatedRequestDto, IAccountSummary } from '@monorepo/web-api-client';

@Controller('account')
export class AccountController {
  constructor(private service: AccountService) {}

  @Post('sign-up')
  @IgnoreAuthentication()
  async onSignUp(@Body() dto: SignUpRequestDto): Promise<void> {
    await this.service.signUp(dto);
  }

  @Delete()
  async onDelete(@CognitoClaims() cognitoClaims): Promise<any> {
    return this.service.delete(cognitoClaims.sub);
  }

  @Get('has-signed-up/:id')
  @IgnoreAuthentication()
  async onGetHasSignedUp(@Param() params): Promise<boolean> {
    return this.service.getHasSignedUp(params.id);
  }

  @Post('authenticated')
  async onAuthenticated(
    @Body() dto: IAccountAuthenticatedRequestDto,
    @CognitoClaims() cognitoClaims
  ): Promise<IAccountSummary> {
    return this.service.onAuthenticated(cognitoClaims.sub, dto);
  }

  @Post('cookie-usage')
  async onPostCookieUsage(@CognitoClaims() cognitoClaims, @Query() query: any): Promise<void> {
    return this.service.toggleCookieUsage(cognitoClaims.sub, query.enable === 'true');
  }
}
