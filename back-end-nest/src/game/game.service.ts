import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { gameStatus } from './enum.gameStatus';

import Game from './game.entity';
import Player from '../player/player.entity';
import User from '../user/user.entity';

import { UserService } from '../user/user.service';

//import { BlockForUserDto } from '../block/block.dto';


@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepo: Repository<Game>,
    @InjectRepository(Player)
    private readonly playerRepo: Repository<Player>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
  ) {}
}
