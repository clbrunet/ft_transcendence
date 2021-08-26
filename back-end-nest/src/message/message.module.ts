import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipantModule } from '../participant/participant.module';

import Participant from '../participant/participant.entity';
import Message from './message.entity';

import { MessageService } from './message.service';

import { MessageController } from './message.controller';


@Module({
  imports: [
  	TypeOrmModule.forFeature([Message, Participant]),
  	ParticipantModule,
  ],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
