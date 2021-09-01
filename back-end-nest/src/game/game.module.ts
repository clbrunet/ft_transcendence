import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { PlayerModule } from '../player/player.module';

import Game from './game.entity';
import Player from '../player/player.entity';

import { GameService } from './game.service';

import { GameController } from './game.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Game, Player]),
    PlayerModule,
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
