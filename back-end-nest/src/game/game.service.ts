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
import { GameHistoryDto } from '../game/game.dto';
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

  public async create(pointToVictory: number, ballSize: number, ballSpeed: number) {
    if (pointToVictory < 3 || pointToVictory > 10) {
      throw new HttpException('pointToVictory must be between 3 and 10', HttpStatus.NOT_FOUND);
    }
    if (ballSize < 1 || ballSize > 10) {
      throw new HttpException('ballSize must be between 1 and 10', HttpStatus.NOT_FOUND);
    }
    if (ballSpeed < 1 || ballSpeed > 10) {
      throw new HttpException('ballSpeed must be between 1 and 10', HttpStatus.NOT_FOUND);
    }
    const game = new Game();
    game.pointToVictory = pointToVictory;
    game.ballSize = ballSize;
    game.ballSpeed = ballSpeed;
    return await this.gameRepo.save(game);
  }

  public async matchByIdObject(userId1: string, userId2: string, pointToVictory: number, ballSize: number, ballSpeed: number) {
    let game = await this.create(pointToVictory, ballSize, ballSpeed);
    const player1 = await this.playerService.create(userId1, game.id);
    const player2 = await this.playerService.create(userId2, game.id);
    return await this.gameRepo.findOne(game.id,
      {
        relations: ['players', 'players.user'],
      }
    );
  }

  public async findAll() {
    return await this.gameRepo.find(
      { 
        relations: ['players', 'players.user'],
        order: { startTime: "DESC", },
      }
    );
  }

  public async findAllLazy() {
    return await this.gameRepo.find(
      { 
        order: { startTime: "DESC", },
      }    
    );
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
    let dto: GameHistoryDto[] = [];
    for (const player of user.players) {
      if (player.game.status === 2) {
        let gameHistoryDto: GameHistoryDto = this.gameToHistoryDto(player.game);
        dto.push(gameHistoryDto);
      }
    }
    return dto;
  }

  public async getAllPrepared(userId: string) {
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
      if (player.game.status === 0) {
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

  public async getGameOngoingActiveUser(userId: string) {
    const games = await this.gameRepo.find(
      {
        relations: ['players', 'players.user'],
        where: [
            { status: 1 },
        ],
      }
    );
    let dto: GameDto[] = [];
    for (const game of games) {
      if (this.isPlayer(userId, game.id)) {
        let gameDto: GameDto = this.gameToDto(game);
        dto.push(gameDto);
      }
    }
    if (dto.length > 1) {
      throw new HttpException('There is more than one game ongoing for User', HttpStatus.NOT_FOUND);
    }
    return dto;
  }

  public async getAllUnfinished() {
    const games = await this.gameRepo.find(
      {
        relations: ['players', 'players.user'],
        where: [
            { status: 3 },
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

  private async setGameAttributes(id: string, pointToVictory: number, ballSize: number, ballSpeed: number) {
    let gameUpdateDto = new GameUpdateDto();
    gameUpdateDto.pointToVictory = pointToVictory;
    gameUpdateDto.ballSize = ballSize;
    gameUpdateDto.ballSpeed = ballSpeed;
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

  public async setAsUnfinished(userId:string, id: string) {
    if (!(await this.isPlayer(userId, id))) {
      throw new HttpException('User is not a Player of that Game', HttpStatus.NOT_FOUND);
    }    
    const game = await this.findById(id);
    for (const player of game.players) {
      if (player.user.status == 2) {
        let userUpdateDto = new UserUpdateDto();
        userUpdateDto.status = 1;
        this.userService.update(player.user.id, userUpdateDto);
      }
    }
    let gameUpdateDto = new GameUpdateDto();
    gameUpdateDto.status = 3;
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
        return true;
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
    const direct = await this.channelService.goDirectActiveUserNoBlock(channelDirectCreationDto);
    const author = await this.participantService.findByUserAndChannelLazy(game.players[0].user.id, direct.id);
    let messageCreationDto = new MessageCreationDto();
    messageCreationDto.authorId = author.id;
    messageCreationDto.content = "The game is about to start, good luck!";
    return await this.messageService.create(messageCreationDto);
  }

  public async victoryMessage(game: Game) {
    let channelDirectCreationDto = new ChannelDirectCreationDto();
    channelDirectCreationDto.userId1 = game.players[0].user.id;
    channelDirectCreationDto.userId2 = game.players[1].user.id;    
    const direct = await this.channelService.goDirectActiveUserNoBlock(channelDirectCreationDto);
    let author;
    if (game.players[0].point > game.players[1].point) {
      author = await this.participantService.findByUserAndChannelLazy(game.players[0].user.id, direct.id);
    }
    else {
      author = await this.participantService.findByUserAndChannelLazy(game.players[1].user.id, direct.id);
    }
    let messageCreationDto = new MessageCreationDto();
    messageCreationDto.authorId = author.id;
    messageCreationDto.content = "I won! ahahahahahahah";
    return await this.messageService.create(messageCreationDto);
  }

  public async launchActiveUser(userId: string, id: string, pointToVictory: number, ballSize: number, ballSpeed: number) {
    if (!(await this.isPlayer(userId, id))) {
      throw new HttpException('User is not a Player of that Game', HttpStatus.NOT_FOUND);
    }
    if (pointToVictory < 3 || pointToVictory > 10) {
      throw new HttpException('pointToVictory must be between 3 and 10', HttpStatus.NOT_FOUND);
    }
    if (ballSize < 1 || ballSize > 10) {
      throw new HttpException('ballSize must be between 1 and 10', HttpStatus.NOT_FOUND);
    }
    if (ballSpeed < 1 || ballSpeed > 10) {
      throw new HttpException('ballSpeed must be between 1 and 10', HttpStatus.NOT_FOUND);
    }
    const game = await this.findById(id);
    await this.setGameAttributes(id, pointToVictory, ballSize, ballSpeed);
    await this.introductionMessage(game);
    await this.setAsOngoing(id);
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
      scoreDto.gameDto = await this.setAsFinished(id);
      for (const player of game.players) {
        let userUpdateDto = new UserUpdateDto();
        userUpdateDto.status = 1;
        await this.userService.update(player.user.id, userUpdateDto);
      }
      if (game.players[0].point > game.players[1].point) {
        await this.userService.updateAsWinner(game.players[0].id);
        await this.userService.updateAsLoser(game.players[1].id);
      }
      if (game.players[1].point > game.players[0].point) {
        await this.userService.updateAsWinner(game.players[1].id);
        await this.userService.updateAsLoser(game.players[0].id);
      }
      await this.victoryMessage(game);
    }
    else {
      scoreDto.outcome = "ongoing";
      scoreDto.gameDto = this.gameToDto(await this.findById(id));
    }
    return scoreDto;
  }

  public async scoreSeed(userId: string, id: string, addedPoint: number) {
    await this.playerService.score(id, userId, addedPoint);
    const game = await this.findById(id);
    const player = await this.playerService.findByGameAndUserLazy(id, userId);
    let scoreDto = new ScoreDto();
    if (player.point == game.pointToVictory) {
      scoreDto.outcome = "finished";
      scoreDto.gameDto = await this.setAsFinished(id);
      for (const player of game.players) {
        let userUpdateDto = new UserUpdateDto();
        userUpdateDto.status = 1;
        await this.userService.update(player.user.id, userUpdateDto);
      }
      if (game.players[0].point > game.players[1].point) {
        await this.userService.updateAsWinner(game.players[0].user.id);
        await this.userService.updateAsLoser(game.players[1].user.id);
      }
      if (game.players[1].point > game.players[0].point) {
        await this.userService.updateAsWinner(game.players[1].user.id);
        await this.userService.updateAsLoser(game.players[0].user.id);
      }
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
    dto.ballSize = game.ballSize;
    dto.ballSpeed = game.ballSpeed;
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
    dto.ballSize = game.ballSize;
    dto.ballSpeed = game.ballSpeed;
    return dto;
  }

  public gameToHistoryDto(game: Game) {
    let dto = new GameHistoryDto();
    dto.id = game.id;
    dto.status = GameStatus[game.status];
    dto.startTime = game.startTime;
    dto.pointToVictory = game.pointToVictory;
    dto.ballSize = game.ballSize;
    dto.ballSpeed = game.ballSpeed;
    if (game.players[0].point > game.players[1].point) {
      dto.winnerName = game.players[0].user.name;
      dto.winnerPoint = game.players[0].point;
      dto.loserName = game.players[1].user.name;
      dto.loserPoint = game.players[1].point;
    }
    else {
      dto.winnerName = game.players[1].user.name;
      dto.winnerPoint = game.players[1].point;
      dto.loserName = game.players[0].user.name;
      dto.loserPoint = game.players[0].point;
    }
    return dto;
  }
}