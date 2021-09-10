import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantModule } from '../participant/participant.module';
import { ChannelModule } from '../channel/channel.module';

import Participant from '../participant/participant.entity';
import Message from './message.entity';

import { MessageService } from './message.service';

import { MessageController } from './message.controller';


@Module({
  imports: [
  	TypeOrmModule.forFeature([Message, Participant]),
  	ParticipantModule,
  	ChannelModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService]
})
export class MessageModule {}
