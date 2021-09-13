import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../authentication/requestWithUser.interface';

import { GameService } from './game.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { GameMatchDto } from './game.dto';
import { GameUpdateDto } from './game.dto';


@Controller('game')
export class GameController {
  constructor( 
  	private readonly gameService: GameService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Post('/launch1/:id')
  async launchActiveUser1(@Req() request: RequestWithUser, @Param('id') id, @Body() gameUpdateDto: GameUpdateDto) {
    const {user} = request;
    return this.gameService.launchActiveUser1(user.id, id, gameUpdateDto.pointToVictory);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('/launch2/:id')
  async launchActiveUser2(@Req() request: RequestWithUser, @Param('id') id) {
    const {user} = request;
    return this.gameService.launchActiveUser2(user.id, id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch('/score/:id')
  async scoreActiveUser(@Req() request: RequestWithUser, @Param('id') id) {
    const {user} = request;
    return await this.gameService.scoreActiveUser(user.id, id, 1);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/history')
  async getHistoryActiveUser(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.gameService.getHistory(user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/history/:userId')
  async getHistoryGivenUser(@Param('userId') userId) {
    return await this.gameService.getHistory(userId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/indexOngoing')
  async getAllOngoing() {
    return await this.gameService.getAllOngoing();
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAll() {
    return await this.gameService.findAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/:gameId')
  async getById(@Param('gameId') gameId) {
    return await this.gameService.getById(gameId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:gameId')
  async unfriend(@Param('gameId') gameId) {
    return await this.gameService.delete(gameId);
  }
}
