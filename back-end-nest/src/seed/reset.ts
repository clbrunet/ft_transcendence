import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
//import * as cookieParser from 'cookie-parser';
//import { ValidationPipe } from '@nestjs/common';

import { SeedService } from '../seed/seed.service';

async function bootstrap() {
  NestFactory.createApplicationContext(AppModule)
    .then(appContext => {
      const seedService = appContext.get(SeedService);
      
      console.log('Erasing users...');
      seedService
        .eraseUser()
        .then(() => {
          console.log('User erasing complete!');
        })
        .catch(error => {
          console.log('Reset failed!');
          throw error;
        })
        .finally(() => appContext.close());
    })
    .catch(error => {
      throw error;
    });
}
bootstrap();