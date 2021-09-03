import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameStatus } from './enum.gameStatus';

import Game from './game.entity';
import Player from '../player/player.entity';

import { PlayerService } from '../player/player.service';
import { UserService } from '../user/user.service';

import { GameUpdateDto } from '../game/game.dto';
import { GameDto } from '../game/game.dto';
import { GameDtoLazy } from '../game/game.dto';
import { PlayerUpdateDto } from '../player/player.dto';
import { PlayerForGameDto } from '../player/player.dto';


@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,

    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly userService: UserService,
  ) {}

  public async create(pointToVictory: number) {
    if (pointToVictory < 1 || pointToVictory > 10) {
      throw new HttpException('pointToVictory must be between 1 and 10', HttpStatus.NOT_FOUND);
    }
    const game = new Game();
    game.pointToVictory = pointToVictory;
    const res = await this.gameRepo.save(game);
    return this.gameToDto(res);
  }

  public async match(userEmail1: string, userEmail2: string, pointToVictory: number) {
    const game = await this.create(pointToVictory);
    const user1 = await this.userService.findByEmailLazy(userEmail1);
    const user2 = await this.userService.findByEmailLazy(userEmail2);
    const player1 = await this.playerService.create(user1.id, game.id);
    const player2 = await this.playerService.create(user2.id, game.id);
    return this.gameToDto(await this.findById(game.id));
  }

  public async getAll() {
    let res: Game[] = [];
    res = await this.gameRepo.find( { relations: ['players'] } );
    let dto: GameDto[] = [];
    res.forEach( game => {
      let gameDto: GameDto = this.gameToDto(game);
      dto.push(gameDto);
    })
    return dto;    
  }

  public async getAllLazy() {
    let res: Game[] = [];
    res = await this.gameRepo.find();
    let dto: GameDtoLazy[] = [];
    res.forEach( game => {
      let gameDtoLazy: GameDtoLazy = this.gameToDtoLazy(game);
      dto.push(gameDtoLazy);
    })
    return dto;    
  }
/*
  public async getAllActiveUser(userId: string) {
    const res = await this.gameService.findByIdFriendOwner(userId);
    let dto: FriendDto[] = [];
    for (const friendOwner of res.friendOwners) {
      const friend = await this.findById(friendOwner.id);
      let friendDto: FriendDto = this.friendToDto(friend);
      dto.push(friendDto);
    }
    return dto;  
  }
*/
  // Return Game Dto
  public async getById(id: string) {
    const game = await this.gameRepo.findOne( id, { relations: ['players'] } );
    if (game) { 
      return this.gameToDto(game);
    }
    throw new HttpException('Game with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Game Object with all relations
  public async findById(id: string) {
    const game = await this.gameRepo.findOne( id, { relations: ['players'] } );
    if (game) {
      return game;
    }
    throw new HttpException('Game with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Game Object without any relation
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
      const game = await this.findByIdLazy(id);
      return this.gameToDtoLazy(game);
    }
    throw new HttpException('Game update failed', HttpStatus.NOT_FOUND);
  }

  public async finish(id: string) {
    let gameUpdateDto = new GameUpdateDto();
    gameUpdateDto.status = 1;
    return await this.gameRepo.update(id, gameUpdateDto);
  }

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('Game with this id does not exist', HttpStatus.NOT_FOUND); 
    }
    await this.gameRepo.delete(id);
    return await this.getAllLazy();
  }

  public gameToDto(game: Game) {
    let dto = new GameDto();
    dto.id = game.id;
    dto.status = GameStatus[game.status];
    dto.startTime = game.startTime;
    dto.pointToVictory = game.pointToVictory;
    dto.players = [];
    if (game.players) {
      game.players.forEach( player => {
        let playerForGameDto = new PlayerForGameDto();
        playerForGameDto.id = player.id;
        playerForGameDto.userId = player.user.id;
        playerForGameDto.userName = player.user.name;
        playerForGameDto.point = player.point;      
        dto.players.push(playerForGameDto);
      })
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