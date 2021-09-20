import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { QueueModule } from '../queue/queue.module';
import { GameModule } from '../game/game.module';
import { PlayerModule } from '../player/player.module';
import { ChannelModule } from '../channel/channel.module';
import { ParticipantModule } from '../participant/participant.module';
import { MessageModule } from '../message/message.module';


import Duel from './duel.entity';
import User from '../user/user.entity';
import Game from '../game/game.entity';

import { DuelService } from './duel.service';

import { DuelController } from './duel.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Duel, User, Game]),
    UserModule,
    QueueModule,
  	GameModule,
  	PlayerModule,
    ChannelModule,
    ParticipantModule,
    MessageModule,
  ],
  controllers: [DuelController],
  providers: [DuelService],
  exports: [DuelService]
})
export class DuelModule {}
