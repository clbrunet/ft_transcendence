import { Controller, Get } from '@nestjs/common';

import User from './user.entity';

import { UserService } from './user.service';

import RegisterDto from '../authentication/register.dto';
import UserDto from './user.dto';
import ChannelDto from '../channel/channel.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/users')
  async findAll() {
    let res: User[] = [];
    res = await this.userService.getAll();
    let dto: UserDto[] = [];
    res.forEach( user => {
      let userDto: UserDto = this.userService.userToDto(user);
      dto.push(userDto);
    })
    return dto;
  }

}

