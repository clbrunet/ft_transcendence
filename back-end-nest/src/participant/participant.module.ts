import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from '../model/participant.entity';
import { User } from '../model/user.entity';
import { Channel } from '../model/channel.entity';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ Participant, User, Channel ])],
  providers: [ParticipantService],
  controllers: [ParticipantController],
})
export class ParticipantModule {}
