import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

/* socket io */

const Express = require("express");
const Http = require("http").Server(Express);
const server_socket = require("socket.io")(Http, {
    cors: {
        origin: `${ process.env.FRONT_URL }`
    }
});

let players = [];

server_socket.on("connection", client_socket => {
  /* imports */
  var chats = require('./socketio/chats.ts');
  chats(server_socket, client_socket, players);
  /* */

  client_socket.on("disconnect", () => {
    players = players.filter(u => u.id !== client_socket.id)
    console.log("user disconnected Nb players = ", players.length);
});
});

Http.listen(3012, () => console.log("Listening on 3012..."));

/* */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONT_URL,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();



