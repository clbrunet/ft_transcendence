import { Controller, Get, Post, Delete, Body, Req, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ParticipantService } from './participant.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { ParticipantCreationDto } from './participant.dto';


@Controller('participant')
export class ParticipantController {
  constructor( private readonly participantService: ParticipantService ) {}

  // ROUTES FOR DEV ONLY TO BE COMMENTED
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
}