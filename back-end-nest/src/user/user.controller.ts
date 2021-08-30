import { Controller, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import User from './user.entity';

import { UserService } from './user.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';

import { UserUpdateDto } from '../user/user.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async getAll() {
    return await this.userService.getAll();
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('/:id')
  async getbyId(@Param('id') id) {
    return await this.userService.getById(id);
  }

  @Patch('/:id')
  async update(@Param('id') id, @Body() userUpdateDto: UserUpdateDto) {
    return this.userService.update(id, userUpdateDto);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:id')
  async delete(@Param('id') id) {
    return await this.userService.delete(id);
  }

}
