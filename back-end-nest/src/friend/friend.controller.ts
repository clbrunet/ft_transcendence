import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import Friend from '../friend/friend.entity';
import RequestWithUser from '../authentication/requestWithUser.interface';

import { FriendService } from './friend.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { FriendCreationActiveUserDto } from './friend.dto';
import { FriendUpdateDto } from './friend.dto';
import { FriendUpdateActiveUserDto } from './friend.dto';


@Controller('friend')
export class FriendController {
  constructor( 
  	private readonly friendService: FriendService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get('/index')
  async getAllActiveUser(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.friendService.getAllActiveUser(user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/index/:id')
  async getAll(@Param('id') id) {
    return await this.friendService.getAll(id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('/:friendId')
  async create(@Req() request: RequestWithUser, @Param('friendId') friendId) {
    const {user} = request;
    return await this.friendService.create(user.id, friendId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch('/accept/:friendId')
  async accept(@Req() request: RequestWithUser, @Param('friendId') friendId) {
    const {user} = request;
    return await this.friendService.updateStatus(user.id, friendId, 2);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch('/reject/:friendId')
  async reject(@Req() request: RequestWithUser, @Param('friendId') friendId) {
    const {user} = request;
    return await this.friendService.reject(user.id, friendId);;
  }
 
  @UseGuards(JwtTwoFactorGuard)
  @Delete('/unfriend/:friendId')
  async unfriend(@Req() request: RequestWithUser, @Param('friendId') friendId) {
    const {user} = request;
    return await this.friendService.unfriend(user.id, friendId);
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
/*
  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAll() {
    return await this.friendService.findAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/:id')
  async findById(@Param('id') id) {
    return await this.friendService.findById(id);
  }
*/
}