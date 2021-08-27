import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';

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
      let res;
      try {
        res = await this.channelRepo.save(channel);
      }
      catch(error) {
        if (error?.code === '23505') {
          throw new HttpException('Channel with that name already exists', HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
      }
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
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel Object
  public async findById(id: string) {
    const channel = await this.channelRepo.findOne( id, { relations: ['participants'] } );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel Object
  public async findByName(name: string) {
    const channel = await this.channelRepo.findOne( { name }, { relations: ['participants'] } );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this name does not exist', HttpStatus.NOT_FOUND);
  }

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
    }
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
    if (channel.participants) {
      channel.participants.forEach( participant => {
        let participantForChannelDto = new ParticipantForChannelDto();
        participantForChannelDto.id = participant.user.id;
        participantForChannelDto.name = participant.user.name;
        participantForChannelDto.admin = participant.admin;
        participantForChannelDto.mute = participant.mute;
        participantForChannelDto.ban = participant.ban;
        dto.participants.push(participantForChannelDto);
      })
    }
    return dto;
  }
}
