import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../user/user.entity';
import Friend from '../friend/friend.entity';
import Block from '../block/block.entity';
import Duel from '../duel/duel.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';
import Message from '../message/message.entity';

import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../user/user.service';
import { FriendService } from '../friend/friend.service';
import { BlockService } from '../block/block.service';
import { DuelService } from '../duel/duel.service';
import { ChannelService } from '../channel/channel.service';
import { ParticipantService } from '../participant/participant.service';
import { MessageService } from '../message/message.service';

import { registers } from './data';
import { users } from './data';
import { friends } from './data';
import { blocks } from './data';
import { duels } from './data';
import { channels } from './data';
import { participants } from './data';
import { messages } from './data';

import { UserUpdateDto } from '../user/user.dto';
import { ChannelCreationDto } from '../channel/channel.dto';
import { ParticipantCreationDto } from '../participant/participant.dto';
import { MessageCreationDto } from '../message/message.dto';


@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendRepo: Repository<Friend>,
    @InjectRepository(Block)
    private readonly blockRepo: Repository<Block>,
    @InjectRepository(Channel)
    private readonly duelRepo: Repository<Duel>,
    @InjectRepository(Duel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,

    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly friendService: FriendService,
    private readonly blockService: BlockService,
    private readonly duelService: DuelService,
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
	  	// wait 0.5 sec between registers because of the 42 API limit of 2 requests/second
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    console.log('Register seeding complete!');
    return true;
  }

  async seedUser() {
    console.log('Seeding users...');
    for await (const user of users) {
      let user2 = await this.userService.findByEmail(user.email);
      let userUpdateDto = new UserUpdateDto();
      userUpdateDto.avatar = user.avatar;
      userUpdateDto.level = user.level;
      userUpdateDto.nGames = user.nGames;
      userUpdateDto.nWins = user.nWins;
      userUpdateDto.nLosses = user.nLosses;
      userUpdateDto.xp = user.xp;      
      await this.userService.update(user2.id, userUpdateDto);
    }
    console.log('User seeding complete!');
    return true;
  }

  async seedFriend() {
    console.log('Seeding friends...');
    for await (const friend of friends) {
      let friendOwner = await this.userService.findByEmail(friend.friendOwnerEmail);
      let friendAttribute = await this.userService.findByEmail(friend.friendEmail);
      await this.friendService.create(friendOwner.id, friendAttribute.id);
      const friendObject = await this.friendService.findByOwnerAndFriend(friendOwner.id, friendAttribute.id);
      if (friend.status === 2) {
        await this.friendService.updateStatus(friendObject.friend.id, friendObject.friendOwner.id, friend.status);
      }
    }
    console.log('Friend seeding complete!');
    return true;
  }

  async seedBlock() {
    console.log('Seeding blocks...');
    for await (const block of blocks) {
      let blockOwner = await this.userService.findByEmail(block.blockOwnerEmail);
      let blockAttribute = await this.userService.findByEmail(block.blockEmail);
      await this.blockService.create(blockOwner.id, blockAttribute.id);
    }
    console.log('Block seeding complete!');
    return true;
  }

  async seedDuel() {
    console.log('Seeding duels...');
    for await (const duel of duels) {
      let duelOwner = await this.userService.findByEmail(duel.duelOwnerEmail);
      let duelAttribute = await this.userService.findByEmail(duel.duelEmail);
      await this.duelService.create(duelOwner.id, duelAttribute.id);
      const duelObject = await this.duelService.findByOwnerAndDuel(duelOwner.id, duelAttribute.id);
      if (duel.status === 2) {
        await this.duelService.updateStatus(duelObject.duel.id, duelObject.duelOwner.id, duel.status);
      }
    }
    console.log('Duel seeding complete!');
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

  async seedMessage() {
    console.log('Seeding messages...');
    for await (const message of messages) {
      let user = await this.userService.findByEmail(message.userEmail);
      let channel = await this.channelService.findByName(message.channelName);
      let author = await this.participantService.findByUserAndChannel(user.id, channel.id);
      let messageCreationDto = new MessageCreationDto();
      messageCreationDto.authorId = author.id;
      messageCreationDto.content = message.content;
      await this.messageService.create(messageCreationDto);
    }
    console.log('Message seeding complete!');
    return true;
  }

}
