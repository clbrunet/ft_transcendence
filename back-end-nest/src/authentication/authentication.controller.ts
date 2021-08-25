import { Body, Req, Res, Controller, HttpCode, Get, Post, UseGuards, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

import User from '../user/user.entity';

import RequestWithUser from './requestWithUser.interface';

import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';

import { LocalAuthenticationGuard } from './localAuthentication.guard';
import { JwtAuthenticationGuard } from './jwtAuthentication.guard';
import JwtTwoFactorGuard from './twoFactor/jwtTwoFactor.guard';

import RegisterDto from './register.dto';


@Controller('authentication')
export class AuthenticationController {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const {user} = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    if (user.isTwoFactorAuthenticationEnabled) {
      return;
    }
    return user;
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.userService.getById(user.id);
  }

}
