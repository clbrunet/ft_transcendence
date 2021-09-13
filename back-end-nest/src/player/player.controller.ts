import { Controller, Get, Post, Patch, Param, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../authentication/requestWithUser.interface';

import { PlayerService } from './player.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { PlayerCreationDto } from './player.dto';


@Controller('player')
export class PlayerController {
  constructor( 
  	private readonly playerService: PlayerService
  ) {}

  // ROUTES FOR DEV ONLY TO BE COMMENTED
  @UseGuards(JwtTwoFactorGuard)
  @Post('/create')
  async create(@Body() playerCreationDto: PlayerCreationDto) {
    return await this.playerService.create(playerCreationDto.userId, playerCreationDto.gameId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAll() {
    return await this.playerService.findAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:playerId')
  async delete(@Param('playerId') playerId) {
    return await this.playerService.delete(playerId);
  }
}