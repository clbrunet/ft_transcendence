import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { QueueModule } from '../queue/queue.module';
import { GameModule } from '../game/game.module';
import { PlayerModule } from '../player/player.module';

import Duel from './duel.entity';
import User from '../user/user.entity';

import { DuelService } from './duel.service';

import { DuelController } from './duel.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Duel, User]),
    UserModule,
    QueueModule,
	GameModule,
	PlayerModule,
  ],
  controllers: [DuelController],
  providers: [DuelService],
  exports: [DuelService]
})
export class DuelModule {}
