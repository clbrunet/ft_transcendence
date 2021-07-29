import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import User  from '../user/user.entity';
//import { Participant } from '../participant/participant.entity';
import Channel from './channel.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User]),
    UserModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService]
})
export class ChannelModule {}
