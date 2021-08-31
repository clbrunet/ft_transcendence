import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { ChannelModule } from './channel/channel.module';
import { ParticipantModule } from './participant/participant.module';
import { MessageModule } from './message/message.module';
import { SeedModule } from './seed/seed.module';
import { FriendModule } from './friend/friend.module';
import { BlockModule } from './block/block.module';
import { QueueModule } from './queue/queue.module';
import * as Joi from 'joi';

import { AppService } from './app.service';
import { configService } from './config/config.service';

import { AppController } from './app.controller';


let modified = configService.getTypeOrmConfig();
modified['port'] = 5436;

@Module({
  imports: [
    TypeOrmModule.forRoot(modified),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      })
    }),
    AuthenticationModule,
    ChannelModule,
    ParticipantModule,
    MessageModule,
    SeedModule,
    FriendModule,
    BlockModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
