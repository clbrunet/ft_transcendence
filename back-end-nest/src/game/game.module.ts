import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { PlayerModule } from '../player/player.module';
import { UserModule } from '../user/user.module';
import { ChannelModule } from '../channel/channel.module';
import { ParticipantModule } from '../participant/participant.module';
import { MessageModule } from '../message/message.module';


import Game from './game.entity';
import Player from '../player/player.entity';
import User from '../user/user.entity';

import { GameService } from './game.service';
import { PlayerService } from '../player/player.service';

import { GameController } from './game.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Player, User]),
    forwardRef(() => PlayerModule),
    UserModule,
    ChannelModule,
    ParticipantModule,
    MessageModule,        
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
