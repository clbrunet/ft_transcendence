import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';

import Queue from './queue.entity';
import User from '../user/user.entity';

import { UserService } from '../user/user.service';

import { QueueDto } from './queue.dto';
//import { FriendUpdateDto } from './friend.dto';


@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private readonly queueRepo: Repository<Queue>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
  ) {}

  async create(queuerId: string) {
    const queuer = await this.userService.findById(queuerId);
    if (!queuer) {
      throw new HttpException('Queuer with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    if (await this.inQueue(queuerId) == true) {
      throw new HttpException('User is already in queue', HttpStatus.BAD_REQUEST);
    }
    let queue = new Queue();
    queue.queuer = queuer;
    const res = await this.queueRepo.save(queue);
    return this.queueToDto(res);
  }

  public async getAll() {
    let res: Queue[] = [];
    res = await this.queueRepo.find();
    let dto: QueueDto[] = [];
    res.forEach( queue => {
      let queueDto: QueueDto = this.queueToDto(queue);
      dto.push(queueDto);
    })
    return dto;
  }

  // Return Queue Object
  public async findById(id: string) {
    const queue = await this.queueRepo.findOne(id);
    if (queue) {
      return queue;
    }
    throw new HttpException('Queue with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async inQueue(queuerId: string) {
    const res = await this.getAll();
    res.forEach( queueDto => {
      if (queueDto.queuerId == queuerId) {
      	return true;
      }
    })
    return false;    
  }

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('Queue with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.queueRepo.delete(id);
    return;
  }

  // Return User object
  public async popQueue() {
    const res = await this.getAll();
    await this.delete(res[0].id);
    const queuer = await this.userService.findById(res[0].queuerId);
    return queuer;
  }

  public queueToDto(queue: Queue) {
    let dto = new QueueDto();
    dto.id = queue.id;
    dto.queuerId = queue.queuer.id;
    dto.queueTime = queue.queueTime;
    return dto;
  }
}