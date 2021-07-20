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

  @Get(':id')
  async findOne(@Param('id') id) {
    return await this.serv.findOne(id);
  }

  @Post('/create')
  async create(@Body() channel) {
    return await this.serv.create(channel);
  }

  @Put('/update/:id')
  async update(@Param('id') id, @Body() channel: Channel) {
    return await this.serv.update(id, channel);
  }

  @Delete('/delete/:id')
  async deleteOne(@Param('id') id) {
    return await this.serv.deleteOne(id);
  }

  @Delete('/delete_all')
  async deleteAll() {
    return await this.serv.deleteAll();
  }

}
