import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

import Duel from './duel.entity';
import User from '../user/user.entity';

import { DuelService } from './duel.service';

import { DuelController } from './duel.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Duel, User]),
    UserModule
  ],
  controllers: [DuelController],
  providers: [DuelService],
  exports: [DuelService]
})
export class DuelModule {}
