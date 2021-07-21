import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) { }

  async findAll() {
    return await this.userRepo.find({ relations: ['channels', 'participants'] });
  }

  async findOne(userId: string) {
    const user = await this.userRepo.findOne(userId, { relations: ['channels', 'participants'] });
    if (user === undefined) { return "[Error]: No user at this id!"; }
    return user;
  }

  async create(user: User) {
    return await this.userRepo.save(user);
  }

  async update(userId: string, user: User) {
    await this.userRepo.update(userId, user);
    const res = await this.userRepo.findOne(userId, { relations: ['channels', 'participants'] });
    if (res === undefined) { return "[Error]: No user at this id!"; }
    return res;
  }

  async delete(id: string) {
    await this.userRepo.delete(id);
    return await this.userRepo.find({ relations: ['channels', 'participants'] });
  }
}
