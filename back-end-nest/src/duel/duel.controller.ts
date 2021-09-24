import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import Duel from '../duel/duel.entity';
import RequestWithUser from '../authentication/requestWithUser.interface';

import { DuelService } from './duel.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { DuelCreationActiveUserDto } from './duel.dto';
import { DuelUpdateDto } from './duel.dto';
import { DuelUpdateActiveUserDto } from './duel.dto';
import { DuelDto } from './duel.dto';


@Controller('duel')
export class DuelController {
  constructor( 
    private readonly duelService: DuelService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get('/index')
  async getAllActiveUser(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.duelService.getAllActiveUser(user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('/go/:duelId')
  async go(@Req() request: RequestWithUser, @Param('duelId') duelId) {
    const {user} = request;
    return await this.duelService.go(user.id, duelId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('/:duelId')
  async create(@Req() request: RequestWithUser, @Param('duelId') duelId) {
    const {user} = request;
    return await this.duelService.create(user.id, duelId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch('/accept/:duelId')
  async accept(@Req() request: RequestWithUser, @Param('duelId') duelId) {
    const {user} = request;
    return await this.duelService.accept(user.id, duelId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch('/reject/:duelId')
  async reject(@Req() request: RequestWithUser, @Param('duelId') duelId) {
    const {user} = request;
    return await this.duelService.reject(user.id, duelId);;
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/unduel/:duelId')
  async unduel(@Req() request: RequestWithUser, @Param('duelId') duelId) {
    const {user} = request;
    return await this.duelService.unduel(user.id, duelId);
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
/*
  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAll() {
    return await this.duelService.findAll();
  }
*/
}