import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../model/channel.entity';
import { User } from '../model/user.entity';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, User])],
  providers: [ChannelService],
  controllers: [ChannelController],
})
export class ChannelModule {}
