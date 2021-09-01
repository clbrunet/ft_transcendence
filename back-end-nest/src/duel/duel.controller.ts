import { Controller, Get, Post, Patch, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import Duel from '../duel/duel.entity';
import RequestWithUser from '../authentication/requestWithUser.interface';

import { DuelService } from './duel.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { DuelCreationActiveUserDto } from './duel.dto';
import { DuelUpdateDto } from './duel.dto';
import { DuelUpdateActiveUserDto } from './duel.dto';


@Controller('duel')
export class DuelController {
  constructor( 
    private readonly duelService: DuelService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Post('/:duelId')
  async create(@Req() request: RequestWithUser, @Param('duelId') duelId) {
    const {user} = request;
    return await this.duelService.create(user.id, duelId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async getAll() {
    return await this.duelService.getAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch('/accept/:duelId')
  async accept(@Req() request: RequestWithUser, @Param('duelId') duelId) {
    const {user} = request;
    return await this.duelService.updateStatus(user.id, duelId, 2);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Patch('/reject/:duelId')
  async reject(@Req() request: RequestWithUser, @Param('duelId') duelId) {
    const {user} = request;
    return await this.duelService.unduel(user.id, duelId);;
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/unduel/:duelId')
  async unduel(@Req() request: RequestWithUser, @Param('duelId') duelId) {
    const {user} = request;
    return await this.duelService.unduel(user.id, duelId);
  }
}