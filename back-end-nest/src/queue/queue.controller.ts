import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../authentication/requestWithUser.interface';

import { QueueService } from './queue.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';


@Controller('queue')
export class QueueController {
  constructor( 
  	private readonly queueService: QueueService
  ) {}

  // ROUTES FOR DEV ONLY TO BE COMMENTED

  @UseGuards(JwtTwoFactorGuard)
  @Post()
  async queue(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.queueService.create(user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAll() {
    return await this.queueService.findAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/pop')
  async popQueue(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.queueService.popQueue();
  }

}