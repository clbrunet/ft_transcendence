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
import { DuelModule } from './duel/duel.module';
import { QueueModule } from './queue/queue.module';
import { PlayerModule } from './player/player.module';
import { GameModule } from './game/game.module';
import * as Joi from 'joi';

import { ChatGateway } from './chat.gateway';
import { AppService } from './app.service';
import { configService } from './config/config.service';

import { AppController } from './app.controller';
import { MulterModule } from '@nestjs/platform-express';


let modified = configService.getTypeOrmConfig();
modified['port'] = process.env.POSTGRES_PORT;

@Module({
  imports: [
    TypeOrmModule.forRoot(modified),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      })
    }),
    MulterModule.register({ dest: './avatars' }),
    AuthenticationModule,
    ChannelModule,
    ParticipantModule,
    MessageModule,
    SeedModule,
    FriendModule,
    BlockModule,
    QueueModule,
    DuelModule,
    PlayerModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule { }
