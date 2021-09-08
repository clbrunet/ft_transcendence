import { Controller, Get, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';

import JwtTwoFactorGuard from './authentication/twoFactor/jwtTwoFactor.guard';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
