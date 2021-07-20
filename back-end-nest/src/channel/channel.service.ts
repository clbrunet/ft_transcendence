import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../model/channel.entity';
import { User } from '../model/user.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly repo: Repository<Channel>,
    @InjectRepository(User)
    private readonly repo2: Repository<User>,
    ) {}

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: string) {
    return await this.repo.findOne(id);
  }

  async create(channel: Channel) {
    let user = new User(); // [TO BE FINE TUNED]
    user.display_name = "nico4";
    user.mail = "nico@yopmail4.com";
    user.password = "abcd";
    //await this.repo2.save(user);
    let user2 = await this.repo2.findOne("194ec4c8-628a-4c94-903b-80125792f04a");
    channel.user = user2;
    return await this.repo.save(channel);
  }

  async update(id: string, channel: Channel) {
    await this.repo.update(id, channel);
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
