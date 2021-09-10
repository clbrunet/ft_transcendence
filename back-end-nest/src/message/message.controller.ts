import { Controller, Get, Post, Patch, Delete, Body, Req, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import Participant from '../participant/participant.entity';
import RequestWithUser from '../authentication/requestWithUser.interface';

import { MessageService } from './message.service';
import { ParticipantService } from '../participant/participant.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { MessageCreationActiveUserDto } from './message.dto';
import { MessageCreationDto } from './message.dto';


@Controller('message')
export class MessageController {
  constructor( 
  	private readonly messageService: MessageService,
  	private readonly participantService: ParticipantService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Post('/create/:channelId')
  async create(@Req() request: RequestWithUser, @Param('channelId') channelId, @Body() messageCreationActiveUserDto: MessageCreationActiveUserDto) {
    const {user} = request;
  	let participant = new Participant();
  	participant = await this.participantService.findByUserAndChannelLazy(user.id, channelId);
    return await this.messageService.createActiveUser(user.id, channelId, messageCreationActiveUserDto.content);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all/:channelId')
  async getAllInChannelActiveUser(@Req() request: RequestWithUser, @Param('channelId') channelId) {
    const {user} = request;
    return await this.messageService.getAllInChannelActiveUser(user.id, channelId);
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAll() {
    return await this.messageService.findAllLazy();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get(':id')
  async getById(@Param('id') id) {
    return await this.messageService.getById(id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:id')
  async delete(@Param('id') id) {
    return await this.messageService.delete(id);
  }
}