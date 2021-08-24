import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import RequestWithUser from '../authentication/requestWithUser.interface';

import Participant from './participant.entity';

import { ParticipantService } from './participant.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import ParticipantCreationDto from './participantCreation.dto';


@Controller('participant')
export class ParticipantController {
  constructor( private readonly participantService: ParticipantService ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Post('/create')
  async create(@Req() request: RequestWithUser, @Body() data: ParticipantCreationDto) {
    await this.participantService.create(data);
  }

}