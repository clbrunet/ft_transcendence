import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';

import Queue from './queue.entity';
import User from '../user/user.entity';

import { UserService } from '../user/user.service';
import { GameService } from '../game/game.service';
import { PlayerService } from '../player/player.service';

import { QueueDto } from './queue.dto';
import { GameDto } from '../game/game.dto';
import { UserUpdateDto } from '../user/user.dto';


@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private readonly queueRepo: Repository<Queue>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
  ) {}

  public async create(queuerId: string) {
    const queuer = await this.userService.findByIdLazy(queuerId);
    if (!queuer) {
      throw new HttpException('Queuer with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    if (await this.inQueue(queuer.id)) {
      throw new HttpException('User is already in queue', HttpStatus.BAD_REQUEST);
    }
    if (queuer.status === 2) {
      throw new HttpException('User is in-game and cannot queue at the same time', HttpStatus.BAD_REQUEST);
    }
    let queue = new Queue();
    queue.queuer = queuer;
    const res = await this.queueRepo.save(queue);
    return this.queueToDto(res);
  }

  public async findAll() {
    return await this.queueRepo.find(
      {
        relations: ['queuer'],
        order: { queueTime: "ASC", },
      }
    );
  }

  public async findAllLazy() {
    return await this.queueRepo.find(
      {
        order: { queueTime: "ASC", },
      }
    );
  }

  public async findById(id: string) {
    const queue = await this.queueRepo.findOne(id,
      {
        relations: ['queuer'],
      }
    );
    if (queue) {
      return queue;
    }
    throw new HttpException('Queue with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByIdLazy(id: string) {
    const queue = await this.queueRepo.findOne(id);
    if (queue) {
      return queue;
    }
    throw new HttpException('Queue with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async delete(id: string) {
    try {
      await this.findByIdLazy(id);
    }
    catch(error) {
      throw new HttpException('Queue with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.queueRepo.delete(id);
    return "Successfull Queue deletion";
  }

  public async unqueueActiveUser(userId: string) {
    if (!(await this.inQueue(userId))) {
      throw new HttpException('User is not in queue', HttpStatus.NOT_FOUND);
    }
    const user = await this.userRepo.findOne(userId,
      {
        relations: ['queuers'],
      }
    );
    if (!user) {
      throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.delete(user.queuers[0].id);
    return "Successfull unqueue";
  }

  public async popQueue() {
    const res = await this.findAll();
    if (res.length == 0) {
      throw new HttpException('Queue is empty', HttpStatus.NOT_FOUND);      
    }
    await this.delete(res[0].id);
    const queuer = await this.userService.findByIdLazy(res[0].queuer.id);
    return queuer;
  }

  public async inQueue(queuerId: string) {
    const user = await this.userRepo.findOne(queuerId,
      {
        relations: ['queuers'],
      }
    );
    if (user.queuers.length === 0) {
      return false;
    }
    return true;
  }

  public async isThereAnotherQueuer(queuerId: string) {
    const res = await this.findAllLazy();
    if (res.length == 0) {
      return false;
    }
    if (res.length == 1 && (await this.inQueue(queuerId))) {
      return false;
    }
    return true;
  }

  public async go(userId: string) {
    if (await this.inQueue(userId)) {
      throw new HttpException('User is already in queue', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findByIdLazy(userId);
    if (user.status == 2) {
      throw new HttpException('User is already in-game', HttpStatus.BAD_REQUEST);
    }
    if (await this.isThereAnotherQueuer(userId)) {
      const res = await this.findAll();
      const queuer = await this.userService.findByIdLazy(res[0].queuer.id);
      const gameDto = await this.gameService.matchById(userId, queuer.id, 5);
      let userUpdateDto = new UserUpdateDto();
      userUpdateDto.status = 2;
      await this.userService.update(userId, userUpdateDto);
      await this.userService.update(queuer.id, userUpdateDto);
      await this.delete(res[0].id);
      return gameDto;
    }
    else {
      await this.create(userId);
      let inQueue = await this.inQueue(userId);
      while (inQueue) {
        inQueue = await this.inQueue(userId);
      }
      const players = await this.playerService.findByUserAmongPreparedGame(userId);
      if (players.length === 0) {
        return "Successfull unqueue";
      }
      else if (players.length === 1) {
        return this.gameService.gameToDto(players[0].game);
      }
      else {
        // Impossible route
        throw new HttpException('More than one game in preparation for this user', HttpStatus.NOT_FOUND);
      }
    }
  }

  public queueToDto(queue: Queue) {
    let dto = new QueueDto();
    dto.id = queue.id;
    dto.queuerId = queue.queuer.id;
    dto.queuerName = queue.queuer.name;
    dto.queueTime = queue.queueTime;
    return dto;
  }
}