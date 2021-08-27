import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserModule } from '../user/user.module';
import { ChannelModule } from '../channel/channel.module';
import { ParticipantModule } from '../participant/participant.module';
import { MessageModule } from '../message/message.module';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';
import Message from '../message/message.entity';

import { SeedService } from './seed.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, Channel, Participant, Message]),
    AuthenticationModule,
    UserModule,
    ChannelModule,
    ParticipantModule,
    MessageModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}