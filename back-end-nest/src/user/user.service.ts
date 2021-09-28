import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Level } from './enum.level';
import { Status } from './enum.status';

import User from './user.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';

import RegisterDto from '../authentication/register.dto';
import { UserDtoLazy } from './user.dto';
import { ActiveUserDto } from './user.dto';
import { UserUpdateDto } from './user.dto';
import { ParticipantCreationDto } from '../participant/participant.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {}

  public async create(registerData: RegisterDto) {
    let newUser = await this.userRepository.create(registerData);
    newUser = await this.userRepository.save(newUser);
    await this.addToAllPublicChannel(newUser);
    return newUser;
  }

  private async addToAllPublicChannel(user: User) {
    const channels = await this.channelRepository.find(
      {
        where: { status: 0 },
      }     
    );
    for (const channel of channels) {
        let participant = new Participant();
        participant.user = user;
        participant.channel = channel;
        participant.authorized = true;
        await this.participantRepository.save(participant);
    }
  }

  public async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
    return await this.userRepository.update(userId, { twoFactorAuthenticationSecret: secret });
  }

  public async turnOffTwoFactorAuthentication(userId: string) {
    return await this.userRepository.update(userId, { isTwoFactorAuthenticationEnabled: false });
  }

  public async turnOnTwoFactorAuthentication(userId: string) {
    return await this.userRepository.update(userId, { isTwoFactorAuthenticationEnabled: true });
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

  // return all User dtos without any relation
  public async getAllAdmin(user: User) {
    if (!user.admin) {
      throw new HttpException('User is not an admin', HttpStatus.BAD_REQUEST); 
    }
    let users = [];
    users = await this.userRepository.find(
      { relations: ['queuers'] }
    );
    let dto: ActiveUserDto[] = [];
    for (const user of users) {
      let activeUserDto: ActiveUserDto = this.activeUserToDto(user);
      dto.push(activeUserDto);
    }
    return dto;    
  }

  // Return User DtoLazy without any relation
  public async getByIdLazy(id: string) {
    let user;
    try {
      user = await this.userRepository.findOne(id);
    } catch (error) {
      throw new HttpException('Id does not respect UUID format', HttpStatus.BAD_REQUEST); 
    }
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
    let user;
    try {
      user = await this.userRepository.findOne(id);
    } catch (error) {
      throw new HttpException('Id does not respect UUID format', HttpStatus.BAD_REQUEST); 
    }
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

  public async update(id: string, userUpdateDto: UserUpdateDto) {
    const res = await this.userRepository.update(id, userUpdateDto);
    if (res) {
      const user = await this.findByIdLazy(id);
      return this.userToDtoLazy(user);
    }
    throw new HttpException('User update failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  public async updateAdmin(user: User, id: string, admin: boolean) {
    if (!user.admin) {
      throw new HttpException('User is not an admin', HttpStatus.BAD_REQUEST); 
    }
    if (user.id == id) {
      throw new HttpException('User can not update his own admin status', HttpStatus.NOT_FOUND);
    }
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.admin = admin;
    await this.update(id, userUpdateDto);
    return await this.getByIdLazy(id);
  }

  public async updateAsWinner(id: string) {
    const user = await this.findByIdLazy(id);
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.nGames = user.nGames + 1;
    userUpdateDto.nWins = user.nWins + 1;
    userUpdateDto.xp = user.xp + 10;
    const ratio = (user.nWins + 1)/(user.nGames +1);
    if (ratio < 0.5) {
      userUpdateDto.level = 0;
    }
    else if (ratio >= 0.5 && ratio < 0.9) {
      userUpdateDto.level = 1;
    }
    else if (ratio >= 0.9 && ratio < 0.95) {
      userUpdateDto.level = 2;
    }
    else if (ratio >= 0.95) {
      userUpdateDto.level = 3;
    }
    return await this.update(id, userUpdateDto);
  }

  public async updateAsLoser(id: string) {
    const user = await this.findByIdLazy(id);
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.nGames = user.nGames + 1;
    userUpdateDto.nLosses = user.nLosses + 1;
    const ratio = (user.nWins)/(user.nGames +1);
    if (ratio < 0.5) {
      userUpdateDto.level = 0;
    }
    else if (ratio >= 0.5 && ratio < 0.9) {
      userUpdateDto.level = 1;
    }
    else if (ratio >= 0.9 && ratio < 0.95) {
      userUpdateDto.level = 2;
    }
    else if (ratio >= 0.95) {
      userUpdateDto.level = 3;
    }
    return await this.update(id, userUpdateDto);
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

  public async deleteAdmin(activeUser: User, id: string) {
    if (!activeUser.admin) {
      throw new HttpException('User is not an admin', HttpStatus.BAD_REQUEST); 
    }
    if (activeUser.id == id) {
      throw new HttpException('User can not delete himself', HttpStatus.NOT_FOUND);
    }
    let user;
    try {
      user = await this.findById(id);
    }
    catch(error) {
      throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND); 
    }
    if (user.status != 0) {
      throw new HttpException('Can not delete a user that is not offline', HttpStatus.NOT_FOUND);
    }
    const channels = await this.channelRepository.find(
      {
        relations: ['owner', 'participants', 'participants.user'],
        where: { direct: true },
      }     
    );
    for (const channel of channels) {
      const participant = await this.participantRepository.findOne( { user, channel } );
      if (participant && channel.owner.id != user.id) {
        await this.channelRepository.delete(channel.id);
      }
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
    dto.admin = user.admin;
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
    dto.admin = user.admin;
    return dto;
  }
}
