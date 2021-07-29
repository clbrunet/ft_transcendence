import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Level } from './enum.level';
import { Status } from './enum.status';
import { ChannelStatus } from '../channel/enum.channelStatus';

import User from './user.entity';

import RegisterDto from '../authentication/register.dto';
import UserDto from './user.dto';
import ChannelDto from '../channel/channel.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User> ) {}

  public async create(registerData: RegisterDto) {
    const newUser = await this.userRepository.create(registerData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  public async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.userRepository.update(userId, { twoFactorAuthenticationSecret: secret });
  }

  public async turnOnTwoFactorAuthentication(userId: string) {
    return this.userRepository.update(userId, { isTwoFactorAuthenticationEnabled: true });
  }

  public async getAll() {
    return await this.userRepository.find( { relations: ['channels'] } );
  }

  public async getByEmail(email: string) {
    const user = await this.userRepository.findOne( { email }, { relations: ['channels'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  public async getById(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['channels'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async delete(id: number) {
    await this.userRepository.delete(id);
    return await this.userRepository.find();
  }

  public userToDto(user: User) {
    let dto = new UserDto();
    dto.userId = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.twoFactorAuthenticationSecret = user.twoFactorAuthenticationSecret;
    dto.isTwoFactorAuthenticationEnabled = user.isTwoFactorAuthenticationEnabled;
    dto.avatar = user.avatar;
    dto.status = Status[user.status];
    dto.level = Level[user.level];
    dto.nGames = user.nGames;
    dto.nWins = user.nWins;
    dto.nLosses = user.nLosses;
    dto.xp = user.xp;
    dto.channels = [];
    user.channels.forEach( channel => {
      let channelDto = new ChannelDto();
      channelDto.channelId = channel.id;
      channelDto.channelName = channel.channelName;
      channelDto.channelStatus = ChannelStatus[channel.channelStatus];
      dto.channels.push(channelDto);
    })
    return dto;
  }

}
