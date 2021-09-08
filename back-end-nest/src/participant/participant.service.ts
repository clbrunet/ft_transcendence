import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from './participant.entity';

import { UserService } from '../user/user.service';
import { ChannelService } from '../channel/channel.service';

import { ParticipantCreationDto } from './participant.dto';
import { ParticipantUpdateDto } from './participant.dto';
import { ParticipantDto } from './participant.dto';
import { MessageForParticipantDto } from '../message/message.dto';

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

  public async create(participantCreationDto: ParticipantCreationDto) {
    let participant = new Participant();
    const user = await this.userService.findByIdLazy(participantCreationDto.userId);
    if (user) {
      participant.user = user;
    }
    else {
      throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }
    const channel = await this.channelService.findByIdOwnerBoth(participantCreationDto.channelId);
    if (channel) {
      participant.channel = channel;     
    }
    else {
      throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
    }
    if (channel.status === 0 || channel.status === 1 || channel.owner.id === user.id) {
      participant.authorized = true;
    }
    else {
      participant.authorized = false;
    }
    participant.admin = participantCreationDto.admin; 
    let res;
    try {
      res = await this.participantRepo.save(participant);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Participant with this (userId, channelId) already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong while creating a participant', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this.participantToDto(res);
  }

  public async findAll() {
    return await this.participantRepo.find(
      {
        relations: ['messages'],
        join: {
          alias: "participant",
          leftJoinAndSelect: {
            user: "participant.user",
            channel: "participant.channel",
          },
        },
      }     
    );
  }

  public async findAllMessage() {
    return await this.participantRepo.find(
      {
        relations: ['messages'],
      }     
    );
  }

  public async findAllLazy() {
    return await this.participantRepo.find();
  }

  public async findById(id: string) {
    const participant = await this.participantRepo.findOne(id,
      {
        relations: ['messages'],
        join: {
          alias: "participant",
          leftJoinAndSelect: {
            user: "participant.user",
            channel: "participant.channel",
          },
        },
      } 
    );
    if (participant) {
      return participant;
    }
    throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByIdUser(id: string) {
    const participant = await this.participantRepo.findOne(id,
      {
        join: {
          alias: "participant",
          leftJoinAndSelect: {
            user: "participant.user",
          },
        },
      } 
    );
    if (participant) {
      return participant;
    }
    throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByIdChannel(id: string) {
    const participant = await this.participantRepo.findOne(id,
      {
        join: {
          alias: "participant",
          leftJoinAndSelect: {
            channel: "participant.channel",
          },
        },
      } 
    );
    if (participant) {
      return participant;
    }
    throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByIdMessage(id: string) {
    const participant = await this.participantRepo.findOne(id,
      {
        relations: ['messages'],
      } 
    );
    if (participant) {
      return participant;
    }
    throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByIdLazy(id: string) {
    const participant = await this.participantRepo.findOne(id);
    if (participant) {
      return participant;
    }
    throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async getById(id: string) {
    const participant = await this.participantRepo.findOne(id, { relations: ['messages'] });
    if (participant) {
      return this.participantToDto(participant);
    }
    throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByUserAndChannel(userId: string, channelId: string) {
    const user = await this.userService.findByIdLazy(userId);
    const channel = await this.channelService.findByIdLazyBoth(channelId);
    const participant = await this.participantRepo.findOne( { user, channel },
      {
        relations: ['messages'],
        join: {
          alias: "participant",
          leftJoinAndSelect: {
            user: "participant.user",
            channel: "participant.channel",
          },
        },
      }
    );
    if (participant) {
      return participant;
    }
    throw new HttpException('Participant with this (userId, channelId) does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByUserAndChannelMessage(userId: string, channelId: string) {
    const user = await this.userService.findByIdLazy(userId);
    const channel = await this.channelService.findByIdLazyBoth(channelId);
    const participant = await this.participantRepo.findOne( { user, channel },
      {
        relations: ['messages'],
      }
    );
    if (participant) {
      return participant;
    }
    throw new HttpException('Participant with this (userId, channelId) does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByUserAndChannelLazy(userId: string, channelId: string) {
    const user = await this.userService.findByIdLazy(userId);
    const channel = await this.channelService.findByIdLazyBoth(channelId);
    const participant = await this.participantRepo.findOne( { user, channel } );
    if (participant) {
      return participant;
    }
    throw new HttpException('Participant with this (userId, channelId) does not exist', HttpStatus.NOT_FOUND);
  }

  public async update(id: string, participantUpdateDto: ParticipantUpdateDto) {
    const res = await this.participantRepo.update(id, participantUpdateDto);
    if (res) {
      return await this.findByIdLazy(id);
    }
    throw new HttpException('Participant update failed', HttpStatus.NOT_FOUND);
  }

  public async updateAuthorized(id: string, authorized: boolean) {
    let participantUpdateDto = new ParticipantUpdateDto();
    participantUpdateDto.authorized = authorized;
    return this.update(id, participantUpdateDto);
  }

  public async updateAdmin(id: string, admin: boolean) {
    let participantUpdateDto = new ParticipantUpdateDto();
    participantUpdateDto.admin = admin;
    return this.update(id, participantUpdateDto);
  }

  public async updateMute(id: string, mute: boolean, minutes: number) {
    let participantUpdateDto = new ParticipantUpdateDto();
    participantUpdateDto.mute = mute;
    const currentTime = new Date();
    participantUpdateDto.muteEndDateTime = new Date(currentTime.getTime() + minutes * 60000);
    return this.update(id, participantUpdateDto);
  }

  public async updateBan(id: string, ban: boolean, minutes: number) {
    let participantUpdateDto = new ParticipantUpdateDto();
    participantUpdateDto.ban = ban;
    const currentTime = new Date();
    participantUpdateDto.banEndDateTime = new Date(currentTime.getTime() + minutes * 60000);
    return this.update(id, participantUpdateDto);
  }

  public async updateLeft(id: string, left: boolean) {
    let participantUpdateDto = new ParticipantUpdateDto();
    participantUpdateDto.left = left;
    return this.update(id, participantUpdateDto);
  }

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);  
    }
    await this.participantRepo.delete(id);
    return "Successful Participant deletion";
  }

  public async isParticipant(userId: string, channelId: string) {
    const user = await this.userService.findByIdLazy(userId);
    const channel = await this.channelService.findByIdLazyBoth(channelId);
    const participant = await this.participantRepo.findOne( { user, channel } );
    if (participant && !participant.left) {
      return true;
    }
    return false;
  }

  public participantToDto(participant: Participant) {
    let dto = new ParticipantDto();
    dto.id = participant.id;
    dto.userId = participant.user.id;
    dto.userName = participant.user.name;
    dto.channelId = participant.channel.id;
    dto.channelName = participant.channel.name;
    dto.authorized = participant.authorized;
    dto.admin = participant.admin;
    dto.mute = participant.mute;
    dto.muteEndDateTime = participant.muteEndDateTime;
    dto.ban = participant.ban;
    dto.banEndDateTime = participant.banEndDateTime;
    dto.left = participant.left;
    dto.messages = [];
    if (participant.messages) {
        participant.messages.forEach( message => {
        let messageForParticipantDto = new MessageForParticipantDto();
        messageForParticipantDto.id = message.id;
        messageForParticipantDto.createDateTime = message.createDateTime;
        messageForParticipantDto.content = message.content;
        dto.messages.push(messageForParticipantDto);
        })
    }
    return dto;
  }
}
