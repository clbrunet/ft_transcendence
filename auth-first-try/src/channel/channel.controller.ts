import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from '../model/channel.entity';

@Controller('channel')
export class ChannelController {
  constructor(private readonly serv: ChannelService) {}

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

  @Post('/create')
  async create(@Body() input: {
    ownerId: string, channel_name: string, channel_status: number, channel_password: string
  })
  {
    const { ownerId, channel_name, channel_status, channel_password } = input;
    return await this.serv.create(ownerId, channel_name, channel_status, channel_password);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id) {
    return await this.serv.delete(id);
  }

}
