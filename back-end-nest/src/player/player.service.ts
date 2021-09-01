import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { gameStatus } from '../game/enum.gameStatus';

import Player from './player.entity';
import Game from '../game/game.entity';
import User from '../user/user.entity';

import { UserService } from '../user/user.service';
import { GameService } from '../game/game.service';

//import { BlockForUserDto } from '../block/block.dto';


@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}
}
