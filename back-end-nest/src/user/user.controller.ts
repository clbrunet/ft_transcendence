import { Controller, Get, Post, Delete, Put, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import User from './user.entity';
import RegisterDto from '../authentication/register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly serv: UserService) {}

  @Get('/users')
  async findAll() {
    return await this.serv.getAll();
  }

  @Get('/id/:id')
  async getById(@Param('id') id) {
    return await this.serv.getById(id);
  }

  @Get('/email/:email')
  async getByEmail(@Param('email') email) {
    return await this.serv.getByEmail(email);
  }

  @Delete('/:id')
  async delete(@Param('id') id) {
    return await this.serv.delete(id);
  }
}

