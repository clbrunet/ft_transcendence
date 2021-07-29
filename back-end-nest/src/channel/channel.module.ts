import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

import User  from '../user/user.entity';
import Channel from './channel.entity';
//import { Participant } from '../participant/participant.entity';

import { ChannelService } from './channel.service';

import { ChannelController } from './channel.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User]),
    UserModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService]
})
export class ChannelModule {}
