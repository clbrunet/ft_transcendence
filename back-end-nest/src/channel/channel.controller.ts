import { Controller, Get, Post, Delete, Put, Body, Param, Req, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import Channel from './channel.entity';
import RequestWithUser from '../authentication/requestWithUser.interface';
import ChannelCreationDto from './channelCreation.dto';
import JwtTwoFactorGuard from '../authentication/jwt-two-factor.guard';
import { AuthGuard } from '@nestjs/passport';

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
/*
  @Get('/channels')
  async findAll() {
    return await this.serv.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id) {
    return await this.serv.findOne(id);
  }

  @Get('/:id/participants/')
  async getParticipants(@Param('id') id) {
    return await this.serv.getParticipants(id);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id) {
    return await this.serv.delete(id);
  }
*/
}
