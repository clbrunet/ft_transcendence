import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { ChannelModule } from './channel/channel.module';
import { ParticipantModule } from './participant/participant.module';
import { MessageModule } from './message/message.module';
import * as Joi from 'joi';

import { AppService } from './app.service';
import { configService } from './config/config.service';

import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
      })
    }),
    AuthenticationModule,
    ChannelModule,
    ParticipantModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
