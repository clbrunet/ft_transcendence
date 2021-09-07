import { Controller, Post, Get, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../authentication/requestWithUser.interface';

import Channel from './channel.entity';

import { ChannelService } from './channel.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { ChannelCreationDto } from './channel.dto';
import { ParticipantCreationDto } from '../participant/participant.dto';
import { AuthorizationDto } from './channel.dto';


@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Post('/create')
  async create(@Req() request: RequestWithUser, @Body() channelCreationDto: ChannelCreationDto) {
    const {user} = request;
    channelCreationDto.ownerId = user.id;
    return this.channelService.create(channelCreationDto);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/index')
  async getAllActiveUser(@Req() request: RequestWithUser) {
    const {user} = request;
    return await this.channelService.getAllActiveUser(user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('/addParticipant')
  async addParticipantActiveUser(@Req() request: RequestWithUser, @Body() participantCreationDto: ParticipantCreationDto) {
    const {user} = request;
    return await this.channelService.addParticipantActiveUser(user.id, participantCreationDto);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('/authorization')
  async authorizeActiveUser(@Req() request: RequestWithUser, @Body() authorizationDto: AuthorizationDto) {
    const {user} = request;
    return await this.channelService.authorizeActiveUser(user.id, authorizationDto);
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAll() {
    return await this.channelService.findAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get(':id')
  async getById(@Param('id') id) {
    return await this.channelService.findById(id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:id')
  async delete(@Param('id') id) {
    return await this.channelService.delete(id);
  }
}
