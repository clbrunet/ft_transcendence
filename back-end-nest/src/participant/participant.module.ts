import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ChannelModule } from '../channel/channel.module';

import User  from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from './participant.entity';

import { ParticipantController } from './participant.controller';

import { ParticipantService } from './participant.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User, Participant]),
    UserModule,
    forwardRef(() => ChannelModule)
  ],
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService]
})
export class ParticipantModule {}
