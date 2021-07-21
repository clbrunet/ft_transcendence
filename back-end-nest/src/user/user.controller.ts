import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../model/user.entity';
import { Channel } from '../model/channel.entity';

@Controller('user')
export class UserController {
  constructor(private readonly serv: UserService) {}

  @Get('/users')
  async findAll() {
    return await this.serv.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id) {
    return await this.serv.findOne(id);
  }

  @Post('/create')
  async create(@Body() user: User) {
    return await this.serv.create(user);
  }

  @Put('/update/:id')
  async update(@Param('id') id, @Body() user: User) {
    return await this.serv.update(id, user);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id) {
    return await this.serv.delete(id);
  }
}
