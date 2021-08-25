import { Controller, Post, Get, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../authentication/requestWithUser.interface';

import Channel from './channel.entity';

import { ChannelService } from './channel.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { ChannelCreationDto } from './channel.dto';


@Controller('channel')
export class ChannelController {
  constructor( private readonly channelService: ChannelService ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Post('/create')
  async create(@Req() request: RequestWithUser, @Body() data: ChannelCreationDto) {
    const {user} = request;
    data.ownerId = user.id;
    return await this.channelService.create(data);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async getAll() {
    return await this.channelService.getAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get(':id')
  async getById(@Param('id') id) {
    return await this.channelService.getById(id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:id')
  async delete(@Param('id') id) {
    return await this.channelService.delete(id);
  }

}
