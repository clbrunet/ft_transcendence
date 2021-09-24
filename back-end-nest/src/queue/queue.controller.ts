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

  @UseGuards(JwtTwoFactorGuard)
  @Get('/isThereAnotherQueuer')
  async isThereQueuer(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.queueService.isThereAnotherQueuer(user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('/go')
  async go(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.queueService.go(user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/unqueue')
  async unqueueActiveUser(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.queueService.unqueueActiveUser(user.id);
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
/*
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
*/
}