import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import User from './user.entity';

import { UserService } from './user.service';

import JwtTwoFactorGuard from '../authentication/twoFactor/jwtTwoFactor.guard';


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

  @UseGuards(JwtTwoFactorGuard)
  @Delete('/:id')
  async delete(@Param('id') id) {
    return await this.userService.delete(id);
  }

}
