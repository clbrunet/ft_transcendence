import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
//import * as cookieParser from 'cookie-parser';
//import { ValidationPipe } from '@nestjs/common';

import { SeedService } from '../seed/seed.service';

async function bootstrap() {
  NestFactory.createApplicationContext(AppModule)
    .then(appContext => {
      const seedService = appContext.get(SeedService);
      let resRegister = seedService.seedRegister()
        .then((resRegister) => {
          let resUser = seedService.seedUser();
          return resUser;
        })
        .then((resUser) => {
          let resFriend = seedService.seedFriend();
          return resFriend;
        })
        .then((resFriend) => {
          let resBlock = seedService.seedBlock();
          return resBlock;
        })
        .then((resBlock) => {
          let resDuel = seedService.seedDuel();
          return resDuel;
        })
        .then((resDuel) => {
          let resGame = seedService.seedGame();
          return resGame;
        })
        .then((resGame) => {
          let resChannel = seedService.seedChannel();
          return resChannel;
        })
        .then((resChannel) => {
          let resParticipant = seedService.seedParticipant();
          return resParticipant;
        })
        .then((resParticipant) => {
          let resDirect = seedService.seedDirect();
          return resDirect;
        })
        .then((resDirect) => {
          let resMessage = seedService.seedMessage();
          return resMessage;
        })
        .catch(error => {
          console.log('Seeding failed!');
          throw error;
        })
        .finally(() => {
          appContext.close();
        });
    })
    .catch(error => {
      console.log('Something wrong happened...')
      throw error;
    });
}
bootstrap();
