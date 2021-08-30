import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

import Friend from './friend.entity';
import User from '../user/user.entity';

import { FriendService } from './friend.service';

import { FriendController } from './friend.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, User]),
    UserModule
  ],
  controllers: [FriendController],
  providers: [FriendService],
  exports: [FriendService]
})
export class FriendModule {}
