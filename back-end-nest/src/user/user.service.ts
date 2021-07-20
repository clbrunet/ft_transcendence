import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) { }

  async findAll() {
    return await this.repo.find({ relations: ['channels'] });
  }

  async findOne(id: string) {
    return await this.repo.findOne(id, { relations: ['channels'] });
  }

  async create(user: User) {
    return await this.repo.save(user);
  }

  async update(id: string, user: User) {
    await this.repo.update(id, user);
    return await this.repo.findOne(id, { relations: ['channels'] });
  }

  async deleteOne(id: string) {
    await this.repo.delete(id);
    return await this.repo.find({ relations: ['channels'] });
  }

  async deleteAll() {
    await this.repo.clear();
    return await this.repo.find({ relations: ['channels'] });
  }
}
