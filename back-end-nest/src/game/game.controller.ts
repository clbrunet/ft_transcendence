import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../authentication/requestWithUser.interface';

import { GameService } from './game.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { GameMatchDto } from './game.dto';


@Controller('game')
export class GameController {
  constructor( 
  	private readonly gameService: GameService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get('/index')
  async getAllActiveUser(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.gameService.getAllGivenUser(user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/index/:userId')
  async getAllGivenUser(@Param('userId') userId) {
    return await this.gameService.getAllGivenUser(userId);
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
  @UseGuards(JwtTwoFactorGuard)
  @Post('/create/:pointToVictory')
  async create(@Param('pointToVictory') pointToVictory) {
    return await this.gameService.create(pointToVictory);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('/match')
  async match(@Body() gameMatchDto: GameMatchDto) {
    const game = await this.gameService.match(gameMatchDto.userEmail1, gameMatchDto.userEmail2, gameMatchDto.pointToVictory);
    return await this.gameService.getById(game.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async getAll() {
    return await this.gameService.getAll();
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
