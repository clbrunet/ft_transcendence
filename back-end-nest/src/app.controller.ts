import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';

import { JwtAuthenticationGuard } from './authentication/jwtAuthentication.guard';
import JwtTwoFactorGuard from './authentication/jwt-two-factor.guard';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
