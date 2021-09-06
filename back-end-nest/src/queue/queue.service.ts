import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';

import Queue from './queue.entity';
import User from '../user/user.entity';

import { UserService } from '../user/user.service';

import { QueueDto } from './queue.dto';


@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private readonly queueRepo: Repository<Queue>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
  ) {}

  private async inQueue(queuerId: string) {
    const queues = await this.findAll();
    for (const queue of queues) {
      if (queue.queuer.id === queuerId) {
        return true;
      }
    }
    return false;
  }

  public async create(queuerId: string) {
    const queuer = await this.userService.findByIdLazy(queuerId);
    if (!queuer) {
      throw new HttpException('Queuer with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    if (await this.inQueue(queuer.id)) {
      throw new HttpException('User is already in queue', HttpStatus.BAD_REQUEST);
    }
    let queue = new Queue();
    queue.queuer = queuer;
    const res = await this.queueRepo.save(queue);
    return this.queueToDto(res);
  }

  // Return all Queue Objects without any joined table
  public async findAll() {
    return await this.queueRepo.find(
      {
        join: {
          alias: "queue",
          leftJoinAndSelect: {
            queuer: "queue.queuer",
          },
        },
      }
    );
  }

  // Return all Queue Objects with all joined tables
  public async findAllLazy() {
    return await this.queueRepo.find();
  }

  // Return Queue Object with all joined tables
  public async findById(id: string) {
    const queue = await this.queueRepo.findOne(id,
      {
        join: {
          alias: "queue",
          leftJoinAndSelect: {
            queuer: "queue.queuer",
          },
        },
      }
    );
    if (queue) {
      return queue;
    }
    throw new HttpException('Queue with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Queue Object without any joined table
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

  // Return User object
  public async popQueue() {
    const res = await this.findAll();
    if (res.length == 0) {
      throw new HttpException('Queue is empty', HttpStatus.NOT_FOUND);      
    }
    await this.delete(res[0].id);
    const queuer = await this.userService.findByIdLazy(res[0].queuer.id);
    return queuer;
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