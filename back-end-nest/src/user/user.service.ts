import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Level } from './enum.level';
import { Status } from './enum.status';
import { ChannelStatus } from '../channel/enum.channelStatus';
import { FriendStatus } from '../friend/enum.friendStatus';
import { BlockStatus } from '../block/enum.blockStatus';
import { DuelStatus } from '../duel/enum.duelStatus';

import User from './user.entity';

import RegisterDto from '../authentication/register.dto';
import { UserDto } from './user.dto';
import { UserDtoLazy } from './user.dto';
import { ActiveUserDto } from './user.dto';
import { UserUpdateDto } from './user.dto';
import { ParticipantForUserDto } from '../participant/participant.dto';
import { ChannelForUserDto } from '../channel/channel.dto';
import { FriendForUserDto } from '../friend/friend.dto';
import { BlockForUserDto } from '../block/block.dto';
import { DuelForUserDto } from '../duel/duel.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User> ) {}

  public async create(registerData: RegisterDto) {
    const newUser = this.userRepository.create(registerData);
    await this.userRepository.save(newUser);
    return newUser;
  }

  public async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return this.userRepository.update(userId, { twoFactorAuthenticationSecret: secret });
  }

  public async turnOffTwoFactorAuthentication(userId: string) {
    return this.userRepository.update(userId, { isTwoFactorAuthenticationEnabled: false });
  }

  public async turnOnTwoFactorAuthentication(userId: string) {
    return this.userRepository.update(userId, { isTwoFactorAuthenticationEnabled: true });
  }

  public async getAll() {
    let res: User[] = [];
    res = await this.userRepository.find( { relations: ['channels', 'participants', 'friends', 'friendOwners', 'blocks', 'blockOwners', 'duels', 'duelOwners', 'queuers', 'players'] } );
    let dto: UserDto[] = [];
    res.forEach( user => {
      let userDto: UserDto = this.userToDto(user);
      dto.push(userDto);
    })
    return dto;    
  }

  public async getAllLazy() {
    let res: User[] = [];
    res = await this.userRepository.find();
    let dto: UserDtoLazy[] = [];
    res.forEach( user => {
      let userDtoLazy: UserDtoLazy = this.userToDtoLazy(user);
      dto.push(userDtoLazy);
    })
    return dto;    
  }

  // Return User Dto with all relations
  public async getById(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['channels', 'participants', 'friends', 'friendOwners', 'blocks', 'blockOwners', 'duels', 'duelOwners', 'queuers', 'players'] } );
    if (user) { 
      return this.userToDto(user);
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User DtoLazy without any relation
  public async getByIdLazy(id: string) {
    const user = await this.userRepository.findOne(id);
    if (user) { 
      return this.userToDtoLazy(user);
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return active User Dto without any relation
  public async getActiveUser(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['queuers'] } );
    if (user) { 
      return this.activeUserToDto(user);
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object with all relations
  public async findById(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['channels', 'participants', 'friends', 'friendOwners', 'blocks', 'blockOwners', 'duels', 'duelOwners', 'queuers', 'players'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object without any relation
  public async findByIdLazy(id: string) {
    const user = await this.userRepository.findOne(id);
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object with channels relation only
  public async findByIdChannel(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['channels'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object with participants relation only
  public async findByIdParticipant(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['participants'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object with friendOwners relation only
  public async findByIdFriendOwner(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['friendOwners'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object with blockOwners relation only
  public async findByIdBlockOwner(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['blockOwners'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object with duelOwners relation only
  public async findByIdDuelOwner(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['duelOwners'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object with queuers relation only
  public async findByIdQueuer(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['queuers'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object with players relation only
  public async findByIdPlayer(id: string) {
    const user = await this.userRepository.findOne( id, { relations: ['players'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }
 
  // Return User Object with all relations
  public async findByEmail(email: string) {
    const user = await this.userRepository.findOne( { email }, { relations: ['channels', 'participants', 'friends', 'friendOwners', 'blocks', 'blockOwners', 'duels', 'duelOwners', 'queuers', 'players'] } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  // Return User Object without any relation
  public async findByEmailLazy(email: string) {
    const user = await this.userRepository.findOne( { email } );
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  public async update(id: string, userUpdateDto: UserUpdateDto): Promise<UserDto> {
    const res = await this.userRepository.update(id, userUpdateDto);
    if (res) {
      const user = await this.findById(id);
      return this.userToDto(user);
    }
    throw new HttpException('User update failed', HttpStatus.NOT_FOUND);
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

  public userToDto(user: User): UserDto {
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
    dto.friends = [];
    user.friendOwners.forEach( friendOwner => {
      let friendForUserDto = new FriendForUserDto();
      friendForUserDto.friendId = friendOwner.friend.id;
      friendForUserDto.friendName = friendOwner.friend.name;
      friendForUserDto.requestStatus = FriendStatus[friendOwner.status];
      if (friendOwner.status === 2) {
        friendForUserDto.userStatus = Status[friendOwner.friend.status];
      }
      else {
        friendForUserDto.userStatus = null;
      }
      dto.friends.push(friendForUserDto);
    })
    dto.blocks = [];
    user.blockOwners.forEach( blockOwner => {
      let blockForUserDto = new BlockForUserDto();
      blockForUserDto.blockId = blockOwner.block.id;
      blockForUserDto.blockName = blockOwner.block.name;
      blockForUserDto.requestStatus = BlockStatus[blockOwner.status];
      dto.blocks.push(blockForUserDto);
    })
    dto.duels = [];
    user.duelOwners.forEach( duelOwner => {
      let duelForUserDto = new DuelForUserDto();
      duelForUserDto.duelId = duelOwner.duel.id;
      duelForUserDto.duelName = duelOwner.duel.name;
      duelForUserDto.requestStatus = DuelStatus[duelOwner.status];
      dto.duels.push(duelForUserDto);
    })
    if (user.queuers.length === 0) {
      dto.inQueue = false;
    }
    else {
      dto.inQueue = true;      
    }
    return dto;
  }

  public activeUserToDto(user: User) {
    let dto = new ActiveUserDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.isTwoFactorAuthenticationEnabled = user.isTwoFactorAuthenticationEnabled;
    dto.avatar = user.avatar;
    dto.status = Status[user.status];
    dto.level = Level[user.level];
    dto.nGames = user.nGames;
    dto.nWins = user.nWins;
    dto.nLosses = user.nLosses;
    dto.xp = user.xp;
    if (user.queuers.length === 0) {
      dto.inQueue = false;
    }
    else {
      dto.inQueue = true;      
    }
    return dto;
  }

  public userToDtoLazy(user: User) {
    let dto = new UserDtoLazy();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.avatar = user.avatar;
    dto.level = Level[user.level];
    dto.nGames = user.nGames;
    dto.nWins = user.nWins;
    dto.nLosses = user.nLosses;
    dto.xp = user.xp;
    return dto;
  }
}
