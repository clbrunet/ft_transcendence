import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from './participant.entity';

import { UserService } from '../user/user.service';
import { ChannelService } from '../channel/channel.service';

import { ParticipantCreationDto } from './participant.dto';
import { ParticipantDto } from './participant.dto';

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

  public async create(data: ParticipantCreationDto) {
    let participant = new Participant();
    const user = await this.userService.findById(data.userId);
    if (user) {
      participant.user = user;
    }
    else {
      throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }
    const channel = await this.channelService.findById(data.channelId);
    if (channel) {
      participant.channel = channel;     
    }
    else {
      throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
    }
    participant.admin = data.admin; 
    let res;
    try {
      res = await this.participantRepo.save(participant);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('User has already joind Channel', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this.participantToDto(res);
  }

  public async getAll() {
    let res: Participant[] = [];
    res = await this.participantRepo.find();
    let dto: ParticipantDto[] = [];
    res.forEach( participant => {
      let participantDto: ParticipantDto = this.participantToDto(participant);
      dto.push(participantDto);
    })
    return dto;    
  }

  // Return Participant Dto 
  public async getById(id: string) {
    const participant = await this.participantRepo.findOne(id);
    if (participant) {
      return this.participantToDto(participant);
    }
    throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel Object
  public async findById(id: string) {
    const participant = await this.participantRepo.findOne(id);
    if (participant) {
      return participant;
    }
    throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('Participant with this id does not exist', HttpStatus.NOT_FOUND);  
    }
    await this.participantRepo.delete(id);
    return await this.getAll();
  }

  public participantToDto(participant: Participant) {
    let dto = new ParticipantDto();
    dto.id = participant.id;
    dto.userId = participant.user.id;
    dto.userName = participant.user.name;
    dto.channelId = participant.channel.id;
    dto.channelName = participant.channel.name;
    dto.admin = participant.admin;
    dto.mute = participant.mute;
    dto.ban = participant.ban;
    return dto;
  }
}
