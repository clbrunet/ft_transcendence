import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Level } from './enum.level';
import { Status } from './enum.status';

import User from './user.entity';

import RegisterDto from '../authentication/register.dto';
import { UserDtoLazy } from './user.dto';
import { ActiveUserDto } from './user.dto';
import { UserUpdateDto } from './user.dto';


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

  // return all User objects with all relations
  public async findAll() {
    return await this.userRepository.find( { relations: ['channels', 'participants', 'friends', 'friendOwners', 'blocks', 'blockOwners', 'duels', 'duelOwners', 'queuers', 'players'] } );
  }

  // return all User objects without any relation
  public async findAllLazy() {
    return await this.userRepository.find();
  }

  // return all User dtos without any relation
  public async getAllLazy() {
    let users = [];
    users = await this.userRepository.find();
    let dto: UserDtoLazy[] = [];
    for (const user of users) {
      let userDtoLazy: UserDtoLazy = this.userToDtoLazy(user);
      dto.push(userDtoLazy);
    }
    return dto;    
  }

  // Return User DtoLazy without any relation
  public async getByIdLazy(id: string) {
    const user = await this.userRepository.findOne(id);
    if (user) { 
      return this.userToDtoLazy(user);
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return active User Dto without any relation (except queuers)
  public async getActiveUser(id: string) {
    const user = await this.userRepository.findOne(id, { relations: ['queuers'] } );
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

  public async findByNameLazy(name: string) {
    const user = await this.userRepository.findOne( { name } );
    if (user) {
      return user;
    }
    return;
  } 

  public async update(id: string, userUpdateDto: UserUpdateDto): Promise<UserDtoLazy> {
    const res = await this.userRepository.update(id, userUpdateDto);
    if (res) {
      const user = await this.findById(id);
      return this.userToDtoLazy(user);
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
    return 'Successfull User deletion';
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
