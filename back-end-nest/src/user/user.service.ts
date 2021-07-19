import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) { }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: string) {
    return await this.repo.findOne(id);
  }

  async create(user: User) {
    return await this.repo.save(user);
  }

  async update(id: string, user: User) {
    await this.repo.update(id, user);
    return await this.repo.findOne(id);
  }

  async deleteOne(id: string) {
    await this.repo.delete(id);
    return await this.repo.find();
  }

  async deleteAll() {
    await this.repo.clear();
    return await this.repo.find();
  }
}
