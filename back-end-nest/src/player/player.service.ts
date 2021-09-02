import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Player from './player.entity';
import User from '../user/user.entity';
import Game from '../game/game.entity';

import { UserService } from '../user/user.service';
import { GameService } from '../game/game.service';

import { PlayerDto } from './player.dto';


@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,

    private readonly userService: UserService,
    @Inject(forwardRef(() => GameService))
    private readonly gameService: GameService,
  ) {}

  public async create(userId: string, gameId: string) {
    const user = await this.userService.findByIdLazy(userId);
    if (!user) {
      throw new HttpException('User with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    const game = await this.gameService.findById(gameId);
    if (!game) {
      throw new HttpException('Game with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    if (game.players.length == 2) {
      throw new HttpException('Already two players in that game', HttpStatus.BAD_REQUEST); 
    }
    let player = new Player();
    player.user = user;
    player.game = game;
    let res;
    try {
      res = await this.playerRepo.save(player);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('User is already a Player of that Game', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return this.playerToDto(res);
  }

  public async getAll() {
    let res: Player[] = [];
    res = await this.playerRepo.find();
    let dto: PlayerDto[] = [];
    res.forEach( player => {
      let playerDto: PlayerDto = this.playerToDto(player);
      dto.push(playerDto);
    })
    return dto;    
  }
/*
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
    const game = await this.gameRepo.findOne();
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

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('Game with this id does not exist', HttpStatus.NOT_FOUND); 
    }
    await this.gameRepo.delete(id);
    return await this.getAll();
  }
*/
  public playerToDto(player: Player) {
    let dto = new PlayerDto();
    dto.id = player.id;
    dto.userId = player.id;
    dto.userName = player.user.name;
    dto.gameId = player.game.id;
    dto.score = player.point;
    return dto;
  }
}
