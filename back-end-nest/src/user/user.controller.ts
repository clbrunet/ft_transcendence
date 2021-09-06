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
  @Get('/index')
  async getAllLazy() {
    return await this.userService.getAllLazy();
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
  @UseGuards(JwtTwoFactorGuard)
  @Get('/all')
  async findAll() {
    return await this.userService.findAll();
  }

  // ROUTES NOT FOR DEV
  @UseGuards(JwtTwoFactorGuard)
  @Get('/:id')
  async getbyIdLazy(@Param('id') id) {
    return await this.userService.getByIdLazy(id);
  }

  // ROUTES FOR DEV ONLY TO BE COMMENTED
  @UseGuards(JwtTwoFactorGuard)
  @Get('/eager/:id')
  async findbyId(@Param('id') id) {
    return await this.userService.findById(id);
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
