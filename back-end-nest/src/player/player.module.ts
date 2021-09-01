import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { GameModule } from '../game/game.module';

import Player from './player.entity';
import User from '../user/user.entity';
import Game from '../game/game.entity';

import { PlayerService } from './player.service';

import { PlayerController } from './player.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Player, User, Game]),
    UserModule,
    GameModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
  exports: [PlayerService]
})
export class PlayerModule {}
