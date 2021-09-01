import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Player from './player.entity';
import User from '../user/user.entity';
import Game from '../game/game.entity';

import { UserService } from '../user/user.service';

//import { BlockForUserDto } from '../block/block.dto';


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
  ) {}
}
