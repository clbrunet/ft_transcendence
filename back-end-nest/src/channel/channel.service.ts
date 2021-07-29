import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Channel from '../channel/channel.entity';
import User from '../user/user.entity';
//import { Participant } from '../model/participant.entity';
import ChannelCreationDto from './channelCreation.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
    //@InjectRepository(Participant),
    //private readonly participantRepo: Repository<Participant>,
  ) {}

  async create(data: ChannelCreationDto) {
    let channel = new Channel();
    channel.channelName = data.channelName;
    channel.channelStatus = data.channelStatus;
    channel.password = data.password;
    const owner = await this.userService.getById(data.ownerId);
    channel.owner = owner;
    await this.channelRepo.save(channel);
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
