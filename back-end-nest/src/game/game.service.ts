import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { GameStatus } from './enum.gameStatus';

import Game from './game.entity';
import Player from '../player/player.entity';
import User from '../user/user.entity';

import { PlayerService } from '../player/player.service';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';
import { ChannelService } from '../channel/channel.service';
import { ParticipantService } from '../participant/participant.service';

import { GameUpdateDto } from '../game/game.dto';
import { GameDto } from '../game/game.dto';
import { GameDtoLazy } from '../game/game.dto';
import { ScoreDto } from '../game/game.dto';
import { PlayerUpdateDto } from '../player/player.dto';
import { PlayerForGameDto } from '../player/player.dto';
import { ChannelDirectCreationDto } from '../channel/channel.dto';
import { MessageCreationDto } from '../message/message.dto';
import { UserUpdateDto } from '../user/user.dto';


@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    private readonly participantService: ParticipantService,
    private readonly messageService: MessageService,
  ) {}

  public async create(pointToVictory: number) {
    if (pointToVictory < 1 || pointToVictory > 10) {
      throw new HttpException('pointToVictory must be between 1 and 10', HttpStatus.NOT_FOUND);
    }
    const game = new Game();
    game.pointToVictory = pointToVictory;
    return await this.gameRepo.save(game);
  }

  public async matchById(userId1: string, userId2: string, pointToVictory: number) {
    let game = await this.create(pointToVictory);
    const player1 = await this.playerService.create(userId1, game.id);
    const player2 = await this.playerService.create(userId2, game.id);
    game = await this.gameRepo.findOne(game.id,
      {
        relations: ['players', 'players.user'],
      }
    );
    return this.gameToDto(game);
  }

  public async findAll() {
    return await this.gameRepo.find(
      { relations: ['players', 'players.user'] }
    );
  }

  public async findAllLazy() {
    return await this.gameRepo.find();
  }

  public async getHistory(userId: string) {
    const user = await this.userRepo.findOne(userId,
      {
        relations: ['players', 'players.game', 'players.game.players', 'players.game.players.user'],
      }
    );
    if (!user) {
      throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }
    let dto: GameDto[] = [];
    for (const player of user.players) {
      if (player.game.status === 2) {
        let gameDto: GameDto = this.gameToDto(player.game);
        dto.push(gameDto);
      }
    }
    return dto;
  }

  public async getAllOngoing() {
    const games = await this.gameRepo.find(
      {
        relations: ['players', 'players.user'],
        where: [
            { status: 0 },
            { status: 1 },
        ],
      }
    );
    let dto: GameDto[] = [];
    for (const game of games) {
      let gameDto: GameDto = this.gameToDto(game);
      dto.push(gameDto);
    }
    return dto;
  }

  public async getById(id: string) {
    const game = await this.gameRepo.findOne(id,
      { relations: ['players', 'players.user'] }
    );
    if (game) { 
      return this.gameToDto(game);
    }
    throw new HttpException('Game with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findById(id: string) {
    const game = await this.gameRepo.findOne( id, { relations: ['players', 'players.user'] } );
    if (game) {
      return game;
    }
    throw new HttpException('Game with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByIdLazy(id: string) {
    const game = await this.gameRepo.findOne(id);
    if (game) {
      return game;
    }
    throw new HttpException('Game with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async update(id: string, gameUpdateDto: GameUpdateDto) {
    const res = await this.gameRepo.update(id, gameUpdateDto);
    if (res) {
      const game = await this.gameRepo.findOne(id,
        {
          relations: ['players', 'players.user'],
        }
      );
      return game;
    }
    throw new HttpException('Game update failed', HttpStatus.NOT_FOUND);
  }

  public async setPointToVictory(userId:string, id: string, pointToVictory: number) {
    let gameUpdateDto = new GameUpdateDto();
    gameUpdateDto.pointToVictory = pointToVictory;
    return this.gameToDto(await this.update(id, gameUpdateDto));
  }

  public async setAsOngoing(id: string) {
    let gameUpdateDto = new GameUpdateDto();
    gameUpdateDto.status = 1;
    return this.gameToDto(await this.update(id, gameUpdateDto));
  }

  public async setAsFinished(id: string) {
    let gameUpdateDto = new GameUpdateDto();
    gameUpdateDto.status = 2;
    return this.gameToDto(await this.update(id, gameUpdateDto));
  }

  public async delete(id: string) {
    try {
      await this.findByIdLazy(id);
    }
    catch(error) {
      throw new HttpException('Game with this id does not exist', HttpStatus.NOT_FOUND); 
    }
    await this.gameRepo.delete(id);
    return "Successfull Game deletion";
  }

  public async isPlayer(userId: string, id: string)
  {
    const game = await this.gameRepo.findOne(id,
      {
        relations: ['players', 'players.user'],
      }
    );
    for (const player of game.players) {
      if (player.user.id === userId) {
        return false;
      }
    }
    return false;
  }

  private async getStatus(id: string)
  {
    const game = await this.gameRepo.findOne(id);
    return game.status;
  }

  public async introductionMessage(game: Game) {
    let channelDirectCreationDto = new ChannelDirectCreationDto();
    channelDirectCreationDto.userId1 = game.players[0].user.id;
    channelDirectCreationDto.userId2 = game.players[1].user.id;    
    const direct = await this.channelService.goDirectActiveUser(channelDirectCreationDto);
    const author = await this.participantService.findByUserAndChannelLazy(game.players[0].user.id, direct.id);
    let messageCreationDto = new MessageCreationDto();
    messageCreationDto.authorId = author.id;
    messageCreationDto.content = "We started a game together! Good luck!";
    return await this.messageService.create(messageCreationDto);
  }

  public async victoryMessage(game: Game) {
    let channelDirectCreationDto = new ChannelDirectCreationDto();
    channelDirectCreationDto.userId1 = game.players[0].user.id;
    channelDirectCreationDto.userId2 = game.players[1].user.id;    
    const direct = await this.channelService.goDirectActiveUser(channelDirectCreationDto);
    let author;
    if (game.players[0].point > game.players[1].point) {
      author = await this.participantService.findByUserAndChannelLazy(game.players[0].user.id, direct.id);
    }
    else {
      author = await this.participantService.findByUserAndChannelLazy(game.players[1].user.id, direct.id);
    }
    let messageCreationDto = new MessageCreationDto();
    messageCreationDto.authorId = author.id;
    messageCreationDto.content = "I won! Hahahahahahah";
    return await this.messageService.create(messageCreationDto);
  }

  public async launchActiveUser1(userId: string, id: string, pointToVictory: number) {
    if (!(await this.isPlayer(userId, id))) {
      throw new HttpException('User is not a Player of that Game', HttpStatus.NOT_FOUND);
    }
    const game = await this.findById(id);  
    await this.setPointToVictory(userId, id, pointToVictory);
    await this.introductionMessage(game);
    await this.setAsOngoing(id);
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.status = 2;
    await this.userService.update(userId, userUpdateDto);
    return await this.getById(id);
  }

  public async launchActiveUser2(userId: string, id: string) {
    if (!(await this.isPlayer(userId, id))) {
      throw new HttpException('User is not a Player of that Game', HttpStatus.NOT_FOUND);
    }
    let game = await this.findById(id);
    while (game.status === 0) {
      game = await this.findByIdLazy(id);
    }
    let userUpdateDto = new UserUpdateDto();
    userUpdateDto.status = 2;
    await this.userService.update(userId, userUpdateDto);
    return await this.getById(id); 
  }

  public async scoreActiveUser(userId: string, id: string, addedPoint: number) {
    if (!(await this.isPlayer(userId, id))) {
      throw new HttpException('User is not a Player of that Game', HttpStatus.NOT_FOUND);
    }
    if (await this.getStatus(id) !== 1) {
      throw new HttpException('One cannot score in a Game that is not ongoing', HttpStatus.NOT_FOUND);
    }
    await this.playerService.score(id, userId, addedPoint);
    const game = await this.findById(id);
    const player = await this.playerService.findByGameAndUserLazy(id, userId);
    let scoreDto = new ScoreDto();
    if (player.point == game.pointToVictory) {
      scoreDto.outcome = "finished";
      for (const player of game.players) {
        let userUpdateDto = new UserUpdateDto();
        userUpdateDto.status = 1;
        await this.userService.update(player.user.id, userUpdateDto);
      }
      scoreDto.gameDto = await this.setAsFinished(id);
      await this.victoryMessage(game);
    }
    else {
      scoreDto.outcome = "ongoing";
      scoreDto.gameDto = this.gameToDto(await this.findById(id));
    }
    return scoreDto;
  }

  public gameToDto(game: Game) {
    let dto = new GameDto();
    dto.id = game.id;
    dto.status = GameStatus[game.status];
    dto.startTime = game.startTime;
    dto.pointToVictory = game.pointToVictory;
    dto.players = [];
    if (game.players) {
      for (const player of game.players) {
        let playerForGameDto = new PlayerForGameDto();
        playerForGameDto.id = player.id;
        playerForGameDto.userId = player.user.id;
        playerForGameDto.userName = player.user.name;
        playerForGameDto.point = player.point;      
        dto.players.push(playerForGameDto);
      }
    }
    return dto;
  }

  public gameToDtoLazy(game: Game) {
    let dto = new GameDtoLazy();
    dto.id = game.id;
    dto.status = GameStatus[game.status];
    dto.startTime = game.startTime;
    dto.pointToVictory = game.pointToVictory;
    return dto;
  }
}