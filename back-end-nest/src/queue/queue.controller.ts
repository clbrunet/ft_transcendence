import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import Queue from '../friend/friend.entity';
import RequestWithUser from '../authentication/requestWithUser.interface';

import { QueueService } from './queue.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

//import { FriendUpdateDto } from './friend.dto';
//import { FriendUpdateActiveUserDto } from './friend.dto';


@Controller('queue')
export class QueueController {
  constructor( 
  	private readonly queueService: QueueService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Post()
  async queue(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.queueService.create(user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async getAll() {
    return await this.queueService.getAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/pop')
  async popQueue(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.queueService.popQueue();
  }

}