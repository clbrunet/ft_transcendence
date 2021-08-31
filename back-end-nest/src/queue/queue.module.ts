import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

import Queue from '../queue/queue.entity';
import User from '../user/user.entity';

import { QueueService } from './queue.service';

import { QueueController } from './queue.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Queue, User]),
    UserModule
  ],
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService]
})
export class QueueModule {}
