import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../authentication/requestWithUser.interface';

import Channel from './channel.entity';

import { ChannelService } from './channel.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import ChannelCreationDto from './channelCreation.dto';


@Controller('channel')
export class ChannelController {
  constructor( private readonly channelService: ChannelService ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Post('/create')
  async create(@Req() request: RequestWithUser, @Body() data: ChannelCreationDto) {
    const {user} = request;
    data.ownerId = user.id;
    await this.channelService.create(data);
  }

}
