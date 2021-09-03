import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
//import * as cookieParser from 'cookie-parser';
//import { ValidationPipe } from '@nestjs/common';

import { SeedService } from '../seed/seed.service';

async function bootstrap() {
  NestFactory.createApplicationContext(AppModule)
    .then(appContext => {
      const seedService = appContext.get(SeedService);
      let resChannel = seedService.seedChannel()
        .then((resChannel) => {
          let resParticipant = seedService.seedParticipant();
          return resParticipant;
        })
        .then((resParticipant) => {
          let resMessage = seedService.seedMessage();
          return resMessage;
        })
        .catch(error => {
          console.log('Seeding failed!');
          throw error;
        })
        .finally(() => {
          console.log('Successfull seeding second part!');
          appContext.close();
        });
    })
    .catch(error => {
      console.log('Something wrong happened...')
      throw error;
    });
}
bootstrap();
