import { Injectable, HttpException,  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../model/channel.entity';
import { User } from '../model/user.entity';
import { Participant } from '../model/participant.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
    ) {}

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

  async create(ownerId: string, channel_name: string, channel_status: number, channel_password: string) {
    let channel = new Channel();
    const owner = await this.userRepo.findOne(ownerId);
    if (owner === undefined) { return "[Error]: No channel at this id!"; }
    channel.channel_name = channel_name;
    channel.owner = owner;
    channel.owner_id = owner.id;
    channel.owner_display_name = owner.display_name;
    channel.status = channel_status;
    channel.password = channel_password;
    return await this.channelRepo.save(channel);
  }

  async delete(channelId: string) {
    const channel = await this.channelRepo.findOne(channelId, { relations: ['participants'] });
    if (channel === undefined) { return "[Error]: No channel at this id!"; }
    await this.channelRepo.delete(channelId);
    return await this.channelRepo.find({ relations: ['participants'] });
  }
}
