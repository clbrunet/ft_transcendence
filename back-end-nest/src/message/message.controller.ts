import { Controller, Get, Post, Delete, Body, Req, Param, UseGuards } from '@nestjs/common';
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
  @Post('/create')
  async create(@Req() request: RequestWithUser, @Body() data: MessageCreationActiveUserDto) {
    const {user} = request;
  	let participant = new Participant();
  	participant = await this.participantService.findByUserAndChannel(user.id, data.channelId);
  	let messageCreationDto = new MessageCreationDto();
  	messageCreationDto.authorId = participant.id;
  	messageCreationDto.content = data.content;  	
    return await this.messageService.create(messageCreationDto);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async getAll() {
    return await this.messageService.getAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all/:id')
  async getAllInChannel(@Param('id') id) {
    return await this.messageService.getAllInChannel(id);
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