import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import  User  from './user.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';

import { UserService } from './user.service';

import { UserController } from './user.controller';


@Module({
  imports: [TypeOrmModule.forFeature([User, Channel, Participant])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
