import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';

import { ChannelStatus } from './enum.channelStatus';

import { UserService } from '../user/user.service';

import { ChannelCreationDto } from './channel.dto';
import { ChannelDto } from './channel.dto';
import { UserForChannelDto } from '../user/user.dto';
import { ParticipantForChannelDto } from '../participant/participant.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
    private readonly userService: UserService,
  ) {}

  async create(data: ChannelCreationDto) {
    let channel = new Channel();
    channel.name = data.name;
    channel.status = data.status;
    channel.password = data.password;
    const owner = await this.userService.findById(data.ownerId);
    if (owner) {
    channel.owner = owner;
    const res = await this.channelRepo.save(channel);
    return this.channelToDto(res);
    }
    throw new HttpException('Owner with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async getAll() {
    let res: Channel[] = [];
    res = await this.channelRepo.find( { relations: ['participants'] } );
    let dto: ChannelDto[] = [];
    res.forEach( channel => {
      let channelDto: ChannelDto = this.channelToDto(channel);
      dto.push(channelDto);
    })
    return dto;    
  }

  // Return Channel Dto 
  public async getById(id: string) {
    const channel = await this.channelRepo.findOne( id, { relations: ['participants'] } );
    if (channel) {
      return this.channelToDto(channel);
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel Object
  public async findById(id: string) {
    const channel = await this.channelRepo.findOne( id, { relations: ['participants'] } );
    if (channel) {
      return channel;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async delete(id: string) {
    await this.channelRepo.delete(id);
    return await this.getAll();
  }

  public channelToDto(channel: Channel) {
    let dto = new ChannelDto();
    dto.id = channel.id;
    dto.name = channel.name;
    dto.status = ChannelStatus[channel.status];
    let userForChannelDto = new UserForChannelDto();
    userForChannelDto.id = channel.owner.id;
    userForChannelDto.name = channel.owner.name;
    userForChannelDto.email = channel.owner.email;
    userForChannelDto.avatar = channel.owner.avatar;
    dto.owner = userForChannelDto;
    dto.participants = [];
    channel.participants.forEach( participant => {
      let participantForChannelDto = new ParticipantForChannelDto();
      participantForChannelDto.id = participant.user.id;
      participantForChannelDto.name = participant.user.name;
      participantForChannelDto.admin = participant.admin;
      participantForChannelDto.mute = participant.mute;
      participantForChannelDto.ban = participant.ban;
      dto.participants.push(participantForChannelDto);
    })
    return dto;
  }

/*
  async findAll() {
    return await this.channelRepo.find({ relations: ['participants'] });
  }

  async findOne(channelId: string) {
    const channel = await this.channelRepo.findOne(channelId, { relations: ['participants'] });
    if (channel === undefined) { return "[Error]: No channel at this id!"; }
    return channel;
  }

  async getParticipants(channelId: string) {
    const channel = await this.channelRepo.findOne(channelId, { relations: ['participants'] });
    if (channel === undefined) { return "[Error]: No channel at this id!"; }
    return channel.participants;
  }

  async delete(channelId: string) {
    const channel = await this.channelRepo.findOne(channelId, { relations: ['participants'] });
    if (channel === undefined) { return "[Error]: No channel at this id!"; }
    await this.channelRepo.delete(channelId);
    return await this.channelRepo.find({ relations: ['participants'] });
  }
*/
}
