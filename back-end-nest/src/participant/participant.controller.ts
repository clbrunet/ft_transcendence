import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { Participant } from '../model/participant.entity';

@Controller('participant')
export class ParticipantController {
  constructor(private readonly serv: ParticipantService) {}

  @Get('/participants')
  async findAll() {
    return await this.serv.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    return await this.serv.findOne(id);
  }

  @Get('/isAdmin/:id')
  async isAdmin(@Param('id') id) {
    return await this.serv.isAdmin(id);
  }

  @Get('/isMute/:id')
  async isMute(@Param('id') id) {
    return await this.serv.isMute(id);
  }

  @Get('/isBan/:id')
  async isBan(@Param('id') id) {
    return await this.serv.isBan(id);
  }

  @Post('/create')
  async create(@Body() input: { ownerId: string, channelId: string }) {
    const { ownerId, channelId } = input;
    return await this.serv.create(ownerId, channelId);
  }

  @Put('/toggleAdmin/:id')
  async toggleAdmin(@Param('id') id) {
    return await this.serv.toggleAdmin(id);
  }

  @Put('/toggleMute/:id')
  async toggleMute(@Param('id') id) {
    return await this.serv.toggleMute(id);
  }

  @Put('/toggleBan/:id')
  async toggleBan(@Param('id') id) {
    return await this.serv.toggleBan(id);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id) {
    return await this.serv.delete(id);
  }

}
