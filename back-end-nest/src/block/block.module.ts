import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

import Block from './block.entity';
import User from '../user/user.entity';

import { BlockService } from './block.service';

import { BlockController } from './block.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Block, User]),
    UserModule
  ],
  controllers: [BlockController],
  providers: [BlockService],
  exports: [BlockService]
})
export class BlockModule {}
