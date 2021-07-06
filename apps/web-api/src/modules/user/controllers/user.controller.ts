import { Controller, Post, Body, Get, Delete, Param, Query } from '@nestjs/common';
import { UserService } from './../providers';
import { SignUpRequestDto, UserEditDetailsRequestDto } from './../dto';
import { CognitoClaims, IgnoreAuthentication } from '../../common/decorators';
import { IAccountAuthenticatedRequestDto, IUserSummaryVm } from '@monorepo/web-api-client';

@Controller('user')
export class UserController {

  constructor(private service: UserService) {}

  @Post('authenticated')
  async onAuthenticated(
    @Body() dto: IAccountAuthenticatedRequestDto,
    @CognitoClaims() cognitoClaims
  ): Promise<IUserSummaryVm> {
    return this.service.onAuthenticated(cognitoClaims.sub, dto);
  }

  @Post('cookie-usage')
  async onPostCookieUsage(@CognitoClaims() cognitoClaims, @Query() query: any): Promise<void> {
    return this.service.toggleCookieUsage(cognitoClaims.sub, query.enable === 'true');
  }

  @Delete()
  async onDelete(@CognitoClaims() cognitoClaims): Promise<any> {
    return this.service.delete(cognitoClaims.sub);
  }

  @Post('edit-details')
  async onEditDetails(
    @Body() dto: UserEditDetailsRequestDto,
    @CognitoClaims() cognitoClaims
  ): Promise<void> {
    return this.service.editDetails(cognitoClaims.sub, dto);
  }

  @Post('edit-email')
  async onEditEmail(
    @CognitoClaims() cognitoClaims,
    @Query('email') email: string,
  ): Promise<void> {
    return this.service.editEmail(cognitoClaims.sub, email);
  }

  @Get('has-signed-up/:id')
  @IgnoreAuthentication()
  async onGetHasSignedUp(@Param() params): Promise<boolean> {
    return this.service.getHasSignedUp(params.id);
  }

  @Post('sign-up')
  @IgnoreAuthentication()
  async onSignUp(
    @Body() dto: SignUpRequestDto,
  ): Promise<void> {
    await this.service.signUp(dto);
  }

}
