import { Controller, Get, Post, Delete, Body, Req, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../authentication/requestWithUser.interface';

import { ParticipantService } from './participant.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { ParticipantCreationDto } from './participant.dto';


@Controller('participant')
export class ParticipantController {
  constructor( private readonly participantService: ParticipantService ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get('isParticipant/:channelId')
  async isParticipant(@Req() request: RequestWithUser, @Param('channelId') channelId) {
    const {user} = request;    
    return await this.participantService.isParticipant(user.id, channelId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('isAuthorized/:channelId')
  async isAuthorized(@Req() request: RequestWithUser, @Param('channelId') channelId) {
    const {user} = request;    
    return await this.participantService.isAuthorized(user.id, channelId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('isMute/:channelId')
  async isMute(@Req() request: RequestWithUser, @Param('channelId') channelId) {
    const {user} = request;    
    return await this.participantService.isMute(user.id, channelId);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('isBan/:channelId')
  async isBan(@Req() request: RequestWithUser, @Param('channelId') channelId) {
    const {user} = request;    
    return await this.participantService.isBan(user.id, channelId);
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
/*
  @UseGuards(JwtTwoFactorGuard)
  @Post('/create')
  async create(@Body() data: ParticipantCreationDto) {
    return await this.participantService.create(data);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAll() {
    return await this.participantService.findAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get(':id')
  async getById(@Param('id') id) {
    return await this.participantService.getById(id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:id')
  async delete(@Param('id') id) {
    return await this.participantService.delete(id);
  }
*/
}