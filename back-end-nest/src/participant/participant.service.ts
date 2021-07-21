import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../model/channel.entity';
import { User } from '../model/user.entity';
import { Participant } from '../model/participant.entity';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
  ) {}

  async findAll() {
    return await this.participantRepo.find();
  }

  async findOne(participantId: string) {
    const participant = await this.participantRepo.findOne(participantId, { relations: ['participants'] });
    if (participant === undefined) { return "[Error]: No participant at this id!"; }
    return participant;
  }

  async isAdmin(participantId: string) {
    const participant = await this.participantRepo.findOne(participantId, { relations: ['participants'] });
    if (participant === undefined) { return "[Error]: No participant at this id!"; }
    return participant.admin;
  }

  async isMute(participantId: string) {
    const participant = await this.participantRepo.findOne(participantId, { relations: ['participants'] });
    if (participant === undefined) { return "[Error]: No participant at this id!"; }
    return participant.mute;
  }

  async isBan(participantId: string) {
    const participant = await this.participantRepo.findOne(participantId, { relations: ['participants'] });
    if (participant === undefined) { return "[Error]: No participant at this id!"; }
    return participant.ban;
  }

  async create(ownerId: string, channelId: string) {
    let participant = new Participant();
    let user = await this.userRepo.findOne(ownerId);
    if (user === undefined) { return "[Error]: No user at this id!"; }
    let channel = await this.channelRepo.findOne(channelId);
    if (channel === undefined) { return "[Error]: No channel at this id!"; }
    participant.user = user;
    participant.user_id = user.id;
    participant.user_display_name = user.display_name;
    participant.channel = channel;
    participant.channel_id = channel.id;
    participant.channel_name = channel.channel_name;
    return await this.participantRepo.save(participant);
  }

  async toggleAdmin(participantId: string) {
    let participant = await this.participantRepo.findOne(participantId);
    if (participant === undefined) { return "[Error]: No participant at this id!"; }
    if (participant.admin === true) { participant.admin = false; }
    else { participant.admin = true; }
    await this.participantRepo.update(participantId, participant);
    return await this.participantRepo.findOne(participantId);
  }

  async toggleMute(participantId: string) {
    let participant = await this.participantRepo.findOne(participantId);
    if (participant === undefined) { return "[Error]: No participant at this id!"; }
    if (participant.mute === true) { participant.mute = false; }
    else { participant.mute = true; }
    await this.participantRepo.update(participantId, participant);
    return await this.participantRepo.findOne(participantId);
  }

  async toggleBan(participantId: string) {
    let participant = await this.participantRepo.findOne(participantId);
    if (participant === undefined) { return "[Error]: No participant at this id!"; }
    if (participant.ban === true) { participant.ban = false; }
    else { participant.ban = true; }
    await this.participantRepo.update(participantId, participant);
    return await this.participantRepo.findOne(participantId);
  }

  async delete(participantId: string) {
    await this.participantRepo.delete(participantId);
    return await this.participantRepo.find();
  }

}
