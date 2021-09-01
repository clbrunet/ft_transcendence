import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GameStatus } from './enum.gameStatus';

import Game from './game.entity';
import Player from '../player/player.entity';

import { PlayerService } from '../player/player.service';

import { GameDto } from '../game/game.dto';


@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,

    private readonly playerService: PlayerService,
  ) {}

  public async create() {
    const game = new Game();
    const res = await this.gameRepo.save(game);
    return this.gameToDto(res);
  }

  public gameToDto(game: Game) {
    let dto = new GameDto();
    dto.id = game.id;
    dto.status = GameStatus[game.status];
    dto.startTime = game.startTime;
    return dto;
  }
}
