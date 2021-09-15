import { ClassSerializerInterceptor, Controller, Post, UseInterceptors, Res, UseGuards, Req, Body, UnauthorizedException, HttpCode } from '@nestjs/common';
import { Response } from 'express';

import RequestWithUser from '../requestWithUser.interface';

import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../../user/user.service';

import { JwtAuthenticationGuard } from '../jwtAuthentication.guard';

import { TwoFactorAuthenticationCodeDto } from './twoFactorAuthenticationCode.dto';
import { UserUpdateDto } from '../../user/user.dto';


@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthenticationGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(request.user);

    return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto) {
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid (
      twoFactorAuthenticationCode, request.user );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.turnOnTwoFactorAuthentication(request.user.id);
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
    request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.status = 1;
    return this.userService.update(request.user.id, userUpdateDto);
  }

  @Post('turn-off')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async turnOffTwoFactorAuthentication(@Req() request: RequestWithUser) {

    await this.userService.turnOffTwoFactorAuthentication(request.user.id);
  }

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode } : TwoFactorAuthenticationCodeDto) {
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode, request.user
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
    request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.status = 1;
    return this.userService.update(request.user.id, userUpdateDto);
  }
}
