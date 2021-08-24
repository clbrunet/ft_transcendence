import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from './participant.entity';

import { UserService } from '../user/user.service';
import { ChannelService } from '../channel/channel.service';

import ParticipantCreationDto from './participantCreation.dto';


@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
  ) {}

  async create(data: ParticipantCreationDto) {
    let participant = new Participant();
    const user = await this.userService.getById(data.userId);
    participant.user = user;
    const channel = await this.channelService.getById(data.channelId);
    participant.channel = channel;
    participant.admin = data.admin;    
    await this.participantRepo.save(participant);
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
