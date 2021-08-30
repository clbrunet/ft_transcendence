import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Level } from './enum.level';
import { Status } from './enum.status';
import { ChannelStatus } from '../channel/enum.channelStatus';

import User from './user.entity';

import RegisterDto from '../authentication/register.dto';
import { UserDto } from './user.dto';
import { UserUpdateDto } from './user.dto';
import { ParticipantForUserDto } from '../participant/participant.dto';
import { ChannelForUserDto } from '../channel/channel.dto';


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
    let res: User[] = [];
    res = await this.userRepository.find( { relations: ['channels', 'participants'] } );
    let dto: UserDto[] = [];
    res.forEach( user => {
      let userDto: UserDto = this.userToDto(user);
      dto.push(userDto);
    })
    return dto;    
  }

  // Return User Dto
  public async getById(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['channels', 'participants'] } );
    if (user) {  
      return this.userToDto(user);
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object 
  public async findById(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['channels', 'participants'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object
  public async findByEmail(email: string) {
    const user = await this.userRepository.findOne( { email }, { relations: ['channels', 'participants'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  public async update(id: string, userUpdateDto: UserUpdateDto) {
    let user = await this.userRepository.findOne( id, { relations: ['channels', 'participants'] } );
    if (user) {
      await this.userRepository.update(id, userUpdateDto);
      user = await this.userRepository.findOne( id, { relations: ['channels', 'participants'] } );
      return this.userToDto(user);
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND); 
    }
    await this.userRepository.delete(id);
    return await this.getAll();
  }

  public userToDto(user: User) {
    let dto = new UserDto();
    dto.id = user.id;
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
      let channelForUserDto = new ChannelForUserDto();
      channelForUserDto.id = channel.id;
      channelForUserDto.name = channel.name;
      channelForUserDto.status = ChannelStatus[channel.status];
      dto.channels.push(channelForUserDto);
    })
    dto.participants = [];
    user.participants.forEach( participant => {
      let participantForUserDto = new ParticipantForUserDto();
      participantForUserDto.channelId = participant.channel.id;
      participantForUserDto.channelName = participant.channel.name;
      participantForUserDto.admin = participant.admin;
      participantForUserDto.mute = participant.mute;
      participantForUserDto.ban = participant.ban;
      dto.participants.push(participantForUserDto);
    })
    return dto;
  }

}
