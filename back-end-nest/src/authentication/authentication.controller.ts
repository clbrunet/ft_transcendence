import { Body, Req, Res, Controller, HttpCode, Get, Post, UseGuards, HttpStatus, HttpException, } from '@nestjs/common';
import { Response } from 'express';

import RequestWithUser from './requestWithUser.interface';

import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';
import { QueueService } from '../queue/queue.service';

import { LocalAuthenticationGuard } from './localAuthentication.guard';
import JwtTwoFactorGuard from './twoFactor/jwtTwoFactor.guard';

import RegisterDto from './register.dto';
import { UserUpdateDto } from '../user/user.dto';

import { FortyTwoAuthenticationGuard } from './fortyTwoAuthentication.guard';
import User from 'src/user/user.entity';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly queueService: QueueService
  ) {}

  @HttpCode(200)
  @UseGuards(FortyTwoAuthenticationGuard)
  @Post('fortyTwo')
  async fortyTwoSignIn(@Req() request: RequestWithUser) {
    let user: User;
    try {
      user = await this.userService.findByEmailLazy(request.user.email);
    }
    catch {
      user = await this.authenticationService.register(request.user);
    }
    if (user.isFortyTwoAccount !== true) {
      throw new HttpException('Please login with the local strategy', HttpStatus.BAD_REQUEST);
    }
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    if (user.isTwoFactorAuthenticationEnabled) {
      return;
    }
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.status = 1;
    return await this.userService.update(user.id, userUpdateDto);
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    const res = await this.authenticationService.register(registrationData);
    return await this.userService.getByIdLazy(res.id);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    user.password = undefined;  
    if (user.isTwoFactorAuthenticationEnabled) {
      return;
    }
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.status = 1;
    await this.userService.update(user.id, userUpdateDto);
    return "successfull log-in";
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser) {
    const { user } = request;
    request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.status = 0;
    await this.userService.update(user.id, userUpdateDto);
    const user2 = await this.userService.findByIdQueuer(user.id);
    if (user2.queuers.length !== 0) {
      await this.queueService.delete(user2.queuers[0].id);
    }
    return "successfull log-out";
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.userService.getActiveUser(user.id);
  }

}
