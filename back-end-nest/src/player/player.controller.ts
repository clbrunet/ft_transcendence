import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*
import Friend from '../friend/friend.entity';
import RequestWithUser from '../authentication/requestWithUser.interface';
*/
import { PlayerService } from './player.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { PlayerCreationDto } from './player.dto';

@Controller('player')
export class PlayerController {
  constructor( 
  	private readonly playerService: PlayerService
  ) {}
/*
  @UseGuards(JwtTwoFactorGuard)
  @Get('/index')
  async getAllActiveUser(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.friendService.getAllActiveUser(user.id);
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
*/
  // ROUTES FOR DEV ONLY TO BE COMMENTED
  @UseGuards(JwtTwoFactorGuard)
  @Post('/create')
  async create(@Body() playerCreationDto: PlayerCreationDto) {
    return await this.playerService.create(playerCreationDto.userId, playerCreationDto.gameId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async getAll() {
    return await this.playerService.getAll();
  }
}