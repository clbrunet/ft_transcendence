import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';
import Message from '../message/message.entity';

import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../user/user.service';
import { ChannelService } from '../channel/channel.service';
import { ParticipantService } from '../participant/participant.service';
import { MessageService } from '../message/message.service';

import { registers } from './data';
import { channels } from './data';
import { participants } from './data';

import { ChannelCreationDto } from '../channel/channel.dto';
import { ParticipantCreationDto } from '../participant/participant.dto';


@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    private readonly participantService: ParticipantService,
    private readonly messageService: MessageService,
  ) {}

  async eraseUser() {
  	const users = await this.userService.getAll();
    for await (const user of users) {
	  	await this.userService.delete(user.id);
    }
    return true;
  }

  async seedRegister() {
    console.log('Seeding registers...');
    for await (const register of registers) {
	  	await this.authenticationService.register(register);
    }
    console.log('Register seeding complete!');
    return true;
  }

  async seedChannel() {
    console.log('Seeding channels...');
    for await (const channel of channels) {
    	let owner = await this.userService.findByEmail(channel.ownerEmail);
    	let channelCreationDto = new ChannelCreationDto();
    	channelCreationDto.name = channel.name;
    	channelCreationDto.status = channel.status;
    	channelCreationDto.password = channel.password;
    	channelCreationDto.ownerId = owner.id;
	  	await this.channelService.create(channelCreationDto);
    }
    console.log('Channel seeding complete!');
    return true;
  }

  async seedParticipant() {
    console.log('Seeding participants...');
    for await (const participant of participants) {
      let user = await this.userService.findByEmail(participant.userEmail);
      let channel = await this.channelService.findByName(participant.channelName);
      let participantCreationDto = new ParticipantCreationDto();
      participantCreationDto.userId = user.id;
      participantCreationDto.channelId = channel.id;
      participantCreationDto.admin = participant.admin;
      await this.participantService.create(participantCreationDto);
    }
    console.log('Participant seeding complete!');
    return true;
  }

}
