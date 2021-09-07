import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';

import { ChannelStatus } from './enum.channelStatus';

import { UserService } from '../user/user.service';
import { ParticipantService } from '../participant/participant.service';

import { ChannelCreationDto } from './channel.dto';
import { ParticipantCreationDto } from '../participant/participant.dto';
import { ChannelUpdateDto } from './channel.dto';
import { ParticipantUpdateDto } from '../participant/participant.dto';
import { AuthorizationDto } from './channel.dto';
import { ChannelDtoActiveUser } from './channel.dto';
import { ChannelDtoLazy } from './channel.dto';


@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
    @Inject(forwardRef(() => ParticipantService))
    private readonly participantService: ParticipantService,
  ) {}

  async create(channelCreationDto: ChannelCreationDto) {
    let hashedPassword;
    if (channelCreationDto.status == 2) {
      hashedPassword = await bcrypt.hash(channelCreationDto.password, 10);
    } else {
      hashedPassword = null; 
    }    
    let newChannel;
    try {
      newChannel = this.channelRepo.create(channelCreationDto);
      const owner = await this.userService.findByIdLazy(channelCreationDto.ownerId);
      newChannel.owner = owner;
      newChannel = await this.channelRepo.save({
        ...newChannel,
        password: hashedPassword
      });
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Channel with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let participantCreationDto = new ParticipantCreationDto();
    participantCreationDto.userId = newChannel.owner.id;
    participantCreationDto.channelId = newChannel.id;
    participantCreationDto.admin = true;
    await this.participantService.create(participantCreationDto);
    return this.channelToDtoLazy(newChannel);
  }

  // Return all Channel objects with all relations and joined tables
  public async findAll() {
    return await this.channelRepo.find(
      {
        relations: ['participants'],
        join: {
          alias: "channel",
          leftJoinAndSelect: {
            owner: "channel.owner",
          },
        },
      }     
    );
  }

  // Return all Channel objects with all relations nor joined table
  public async findAllLazy() {
    return await this.channelRepo.find();
  }

  // Return all Channels Dto without any relation
  public async getAllActiveUser(userId: string) {
    const channels = await this.findAll();
    let dto = [];
    for (const channel of channels) {
      if (channel.status == 0 || await this.participantService.isParticipant(userId, channel.id)) {
        const channelDtoActiveUser = await this.channelToDtoActiveUser(userId, channel);
        dto.push(channelDtoActiveUser);
      }
    }
    return dto;    
  }

  // Return Channel object with all relations and joined tables
  public async findById(id: string) {
    const channel = await this.channelRepo.findOne( id,
      {
        relations: ['participants'],
        join: {
          alias: "channel",
          leftJoinAndSelect: {
            owner: "channel.owner",
          },
        },
      }
    );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel object with no relation but joined tables
  public async findByIdOwner(id: string) {
    const channel = await this.channelRepo.findOne( id,
      {
        join: {
          alias: "channel",
          leftJoinAndSelect: {
            owner: "channel.owner",
          },
        },
      }
    );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel Object without any relations nor joined tables
  public async findByIdLazy(id: string) {
    const channel = await this.channelRepo.findOne(id);
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel Object with all relations and joined tables
  public async findByName(name: string) {
    const channel = await this.channelRepo.findOne( { name },
      {
        relations: ['participants'],
        join: {
          alias: "channel",
          leftJoinAndSelect: {
            owner: "channel.owner",
          },
        },
      }
    );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this name does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel Object without any relation nor joined table
  public async findByNameLazy(name: string) {
    const channel = await this.channelRepo.findOne( { name } );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this name does not exist', HttpStatus.NOT_FOUND);
  }

  public async update(id: string, channelUpdateDto: ChannelUpdateDto) {
    const res = await this.channelRepo.update(id, channelUpdateDto);
    if (res) {
      return await this.findByIdLazy(id);
    }
    throw new HttpException('Channel update failed', HttpStatus.NOT_FOUND);
  }
/*
  public async updateActiveUser(id: string, userId: string, channelUpdateDto: ChannelUpdateDto) {
    const res = await this.findByIdLazy(id);
    if (res.owner.id != userId) {
      throw new HttpException('User is not the owner of the channel', HttpStatus.NOT_FOUND);      
    }
    return await this.update(id, channelUpdateDto);
  }

  public async updateOwnerActiveUser(id: string, userId: string, newOwnerId: string) {
    const channel = await this.findById(id);
    if (channel.owner.id != userId) {
      throw new HttpException('User is not the owner of the channel', HttpStatus.NOT_FOUND);      
    }
    if (this.isParticipant(newOwnerId, channel) == false) {
      throw new HttpException('New owner is not a participant of the channel', HttpStatus.NOT_FOUND);   
    }
    let channelUpdateDto = new ChannelUpdateDto();
    channelUpdateDto.ownerId = newOwnerId;
    return await this.update(id, channelUpdateDto);
  }
*/
  public async addParticipantActiveUser(userId: string, participantCreationDto: ParticipantCreationDto) {
    const participantActiveUser = await this.participantService.findByUserAndChannelLazy(userId, participantCreationDto.channelId);
    if (!participantActiveUser.admin) {
      throw new HttpException('User is not an admin of this Channel', HttpStatus.NOT_FOUND);
    }
    let newParticipant;
    try {
      newParticipant = await this.participantService.findByUserAndChannelLazy(participantCreationDto.userId, participantCreationDto.channelId);
    }
    catch(error) {
      return this.participantService.create(participantCreationDto);
    }
    throw new HttpException('User is already a Participant of this Channel', HttpStatus.NOT_FOUND);    
  }

  public async authorizeActiveUser(userId: string, authorizationDto: AuthorizationDto) {
    const participantActiveUser = await this.participantService.findByUserAndChannelLazy(userId, authorizationDto.channelId);
    if (participantActiveUser.authorized) {
      throw new HttpException('User is already authorized for this protected Channel', HttpStatus.NOT_FOUND);
    }
    const channel = await this.findByIdLazy(authorizationDto.channelId);
    const isPasswordMatching = await bcrypt.compare(authorizationDto.password, channel.password);
    if (!isPasswordMatching) {
      throw new HttpException('Wrong email or password provided', HttpStatus.BAD_REQUEST);
    }
    let participantUpdateDto = new ParticipantUpdateDto();
    participantUpdateDto.authorized = true;
    return await this.participantService.update(participantActiveUser.id, participantUpdateDto);
   }

  public async delete(id: string) {
    try {
      await this.findByIdLazy(id);
    }
    catch(error) {
      throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.channelRepo.delete(id);
    return "Successful Channel deletion";
  }

  public async channelToDtoActiveUser(userId: string, channel: Channel) {
    let dto = new ChannelDtoActiveUser();
    dto.id = channel.id;
    dto.name = channel.name;
    dto.status = ChannelStatus[channel.status]; 
    dto.ownerId = channel.owner.id;
    dto.ownerName = channel.owner.name;
    dto.nParticipants = channel.participants.length;
    dto.nUnreadMessages = 0;
    if (await this.participantService.isParticipant(userId, channel.id)) {
      const participantActiveUser = await this.participantService.findByUserAndChannel(userId, channel.id);
      dto.activeUserParticipant = true;
      dto.activeUserAuthorized = participantActiveUser.authorized;
      dto.activeUserAdmin = participantActiveUser.admin;
      dto.activeUserMute = participantActiveUser.mute;
      dto.activeUserMuteEndDateTime = participantActiveUser.muteEndDateTime;
      dto.activeUserBan = participantActiveUser.ban;
      dto.activeUserBanEndDateTime = participantActiveUser.banEndDateTime;
    }
    else {
      dto.activeUserParticipant = false;
      dto.activeUserAuthorized = null;
      dto.activeUserAdmin = null;
      dto.activeUserMute = null;
      dto.activeUserMuteEndDateTime = null;
      dto.activeUserBan = null;
      dto.activeUserBanEndDateTime = null;
    }
    return dto;
  }

  public channelToDtoLazy(channel: Channel) {
    let dto = new ChannelDtoLazy();
    dto.id = channel.id;
    dto.name = channel.name;
    dto.status = ChannelStatus[channel.status];
    dto.password = channel.password;
    dto.ownerId = channel.owner.id;
    dto.ownerName = channel.owner.name;
    return dto;
  }
}
