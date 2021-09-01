import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PlayerModule } from '../player/player.module';

import Game from './game.entity';
import User from '../user/user.entity';
import Player from '../player/player.entity';

import { GameService } from './game.service';

import { GameController } from './game.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Game, User, Player]),
    UserModule,
    forwardRef(() => PlayerModule)
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService]
})
export class GameModule {}
