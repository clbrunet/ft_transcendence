import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ParticipantModule } from '../participant/participant.module';

import User  from '../user/user.entity';
import Channel from './channel.entity';
import Participant from '../participant/participant.entity';

import { ChannelService } from './channel.service';

import { ChannelController } from './channel.controller';
import { DirectController } from './channel.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User]),
    UserModule,
    forwardRef(() => ParticipantModule)
  ],
  controllers: [ChannelController, DirectController],
  providers: [ChannelService],
  exports: [ChannelService]
})
export class ChannelModule {}
