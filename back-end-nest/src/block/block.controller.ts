import { Controller, Get, Post, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import Block from './block.entity';
import RequestWithUser from '../authentication/requestWithUser.interface';

import { BlockService } from './block.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { BlockCreationActiveUserDto } from './block.dto';


@Controller('block')
export class BlockController {
  constructor( 
  	private readonly blockService: BlockService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Post('/:blockId')
  async block(@Req() request: RequestWithUser, @Param('blockId') blockId) {
    const {user} = request;
    return await this.blockService.create(user.id, blockId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async getAll() {
    return await this.blockService.getAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/unblock/:blockId')
  async unblock(@Req() request: RequestWithUser, @Param('blockId') blockId) {
    const {user} = request;
    return await this.blockService.unblock(user.id, blockId);
  }
}