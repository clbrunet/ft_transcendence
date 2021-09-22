import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../user/user.entity';
import Friend from '../friend/friend.entity';
import Block from '../block/block.entity';
import Duel from '../duel/duel.entity';
import Channel from '../channel/channel.entity';
import Game from '../game/game.entity';
import Player from '../player/player.entity';
import Participant from '../participant/participant.entity';
import Message from '../message/message.entity';

import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../user/user.service';
import { FriendService } from '../friend/friend.service';
import { BlockService } from '../block/block.service';
import { DuelService } from '../duel/duel.service';
import { GameService } from '../game/game.service';
import { PlayerService } from '../player/player.service';
import { ChannelService } from '../channel/channel.service';
import { ParticipantService } from '../participant/participant.service';
import { MessageService } from '../message/message.service';

import { registers } from './data';
import { users } from './data';
import { friends } from './data';
import { blocks } from './data';
import { games } from './data';
import { channels } from './data';
import { participants } from './data';
import { messages } from './data';

import { UserUpdateDto } from '../user/user.dto';
import { ChannelCreationDto } from '../channel/channel.dto';
import { ChannelDirectCreationDto } from '../channel/channel.dto';
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
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly channelService: ChannelService,
    private readonly participantService: ParticipantService,
    private readonly messageService: MessageService,
  ) {}

  async eraseUser() {
    let test = await this.userRepo.findOne();
    while (test) {
      await this.userService.delete(test.id);
      console.log('erased one...');
      test = await this.userRepo.findOne();
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

  async seedUser() {
    console.log('Seeding users...');
    for await (const user of users) {
      let user2 = await this.userService.findByEmailLazy(user.email);
      let userUpdateDto = new UserUpdateDto();
      userUpdateDto.avatar = user.avatar;
      await this.userService.update(user2.id, userUpdateDto);
    }
    console.log('User seeding complete!');
    return true;
  }

  async seedFriend() {
    console.log('Seeding friends...');
    for await (const friend of friends) {
      let friendOwner = await this.userService.findByEmailLazy(friend.friendOwnerEmail);
      let friendAttribute = await this.userService.findByEmailLazy(friend.friendEmail);
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
      let blockOwner = await this.userService.findByEmailLazy(block.blockOwnerEmail);
      let blockAttribute = await this.userService.findByEmailLazy(block.blockEmail);
      await this.blockService.create(blockOwner.id, blockAttribute.id);
    }
    console.log('Block seeding complete!');
    return true;
  }

  async seedGame() {
    console.log('Seeding games...');
    for await (const game of games) {
      console.log('Playing one...');
      const match = await this.gameService.create(game.pointToVictory, game.ballSize, game.ballSpeed);
      const user1 = await this.userService.findByEmailLazy(game.userEmail1);
      const user2 = await this.userService.findByEmailLazy(game.userEmail2);
      const player1 = await this.playerService.create(user1.id, match.id);
      const player2 = await this.playerService.create(user2.id, match.id);
      let c = 0;
      while (c < game.playerPoint1) {
        await this.gameService.scoreSeed(user1.id, match.id, 1);
        c = c + 1;
      }
      c = 0;
      while (c < game.playerPoint2) {
        await this.gameService.scoreSeed(user2.id, match.id, 1);
        c = c + 1;
      }
    }
    console.log('Game seeding complete!');
    return true;
  }

  async seedChannel() {
    console.log('Seeding channels...');
    for await (const channel of channels) {
    	let owner = await this.userService.findByEmailLazy(channel.ownerEmail);
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
      let user = await this.userService.findByEmailLazy(participant.userEmail);
      let channel = await this.channelService.findByNameLazy(participant.channelName);
      let participantCreationDto = new ParticipantCreationDto();
      participantCreationDto.userId = user.id;
      participantCreationDto.channelId = channel.id;
      await this.participantService.create(participantCreationDto);
    }
    console.log('Participant seeding complete!');
    return true;
  }

  async seedMessage() {
    console.log('Seeding messages...');
    for await (const message of messages) {
      let user = await this.userService.findByEmailLazy(message.userEmail);
      let channel = await this.channelService.findByNameLazy(message.channelName);
      let author = await this.participantService.findByUserAndChannelLazy(user.id, channel.id);
      let messageCreationDto = new MessageCreationDto();
      messageCreationDto.authorId = author.id;
      messageCreationDto.content = message.content;
      await this.messageService.create(messageCreationDto);
    }
    console.log('Message seeding complete!');
    return true;
  }

}
