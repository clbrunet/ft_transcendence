import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserModule } from '../user/user.module';
import { FriendModule } from '../friend/friend.module';
import { BlockModule } from '../block/block.module';
import { ChannelModule } from '../channel/channel.module';
import { ParticipantModule } from '../participant/participant.module';
import { MessageModule } from '../message/message.module';

import User from '../user/user.entity';
import Friend from '../friend/friend.entity';
import Block from '../block/block.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';
import Message from '../message/message.entity';

import { SeedService } from './seed.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend, Block, Channel, Participant, Message]),
    AuthenticationModule,
    UserModule,
    FriendModule,
    BlockModule,
    ChannelModule,
    ParticipantModule,
    MessageModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}