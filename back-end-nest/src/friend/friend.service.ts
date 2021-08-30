import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Friend from './friend.entity';
import User from '../user/user.entity';

import { RequestStatus } from './enum.requestStatus';

import { UserService } from '../user/user.service';

import { FriendDto } from './friend.dto';
import { FriendUpdateDto } from './friend.dto';


@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepo: Repository<Friend>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
  ) {}

  async create(connectorId: string, friendId: string) {
    const connector = await this.userService.findById(connectorId);
    if (!connector) {
      throw new HttpException('Connector with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    const friend = await this.userService.findById(friendId);
    if (!friend) {
      throw new HttpException('Friend with this id does not exist', HttpStatus.BAD_REQUEST);
    }

    let friendObject = new Friend();
    friendObject.connector = connector;
    friendObject.friend = friend;
    friendObject.status = 0;
    let res;
    try {
      res = await this.friendRepo.save(friendObject);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Friend relationship between those two users already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let ret = [];
    ret.push(this.friendToDto(res));

    let friendObject2 = new Friend();
    friendObject2.connector = friend;
    friendObject2.friend = connector;
    friendObject2.status = 1;
    try {
      res = await this.friendRepo.save(friendObject2);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Friend relationship between those two users already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    ret.push(this.friendToDto(res));
    return ret;
  }

  public async getAll() {
    let res: Friend[] = [];
    res = await this.friendRepo.find();
    let dto: FriendDto[] = [];
    res.forEach( friend => {
      let friendDto: FriendDto = this.friendToDto(friend);
      dto.push(friendDto);
    })
    return dto;    
  }

  // Return Friend Object
  public async findById(id: string) {
    const friend = await this.friendRepo.findOne(id);
    if (friend) {
      return friend;
    }
    throw new HttpException('Friend with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Friend Object
  public async findByConnectorAndFriend(connectorId: string, friendId: string) {
    const connector = await this.userService.findById(connectorId);
    const friend = await this.userService.findById(friendId);
    const friendObject = await this.friendRepo.findOne( { connector, friend } );
    if (friendObject) {
      return friendObject;
    }
    throw new HttpException('Friend with this (connectorId, friendId) does not exist', HttpStatus.NOT_FOUND);
  }

  public async update(id: string, friendUpdateDto: FriendUpdateDto) {
    const res = await this.friendRepo.update(id, friendUpdateDto);
    if (res) {
      const friend = await this.findById(id);
      return this.friendToDto(friend);
    }
    throw new HttpException('Friend update failed', HttpStatus.NOT_FOUND);
  }

  public async updateStatus(userId: string, friendId: string, status: number) {
    let friend = await this.findByConnectorAndFriend(userId, friendId);
    if (friend.status === 0) {
      throw new HttpException('You have to wait for the invited Friend to accept or reject', HttpStatus.NOT_FOUND);
    }
    if (friend.status === 2) {
      throw new HttpException('The request has already been accepted', HttpStatus.NOT_FOUND);
    }
    if (friend.status === 3) {
      throw new HttpException('The request has already been rejected', HttpStatus.NOT_FOUND);
    }
    let friendUpdateDto = new FriendUpdateDto();
    friendUpdateDto.status = status;
    await this.update(friend.id, friendUpdateDto);
    let res = await this.findById(friend.id);
    let ret = [];
    ret.push(this.friendToDto(res));

    let friend2 = await this.findByConnectorAndFriend(friendId, userId);
    let friendUpdateDto2 = new FriendUpdateDto();
    friendUpdateDto2.status = status;
    await this.update(friend2.id, friendUpdateDto2);
    let res2 = await this.findById(friend2.id);
    ret.push(this.friendToDto(res2));

    return ret;
  }

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('Friend with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.friendRepo.delete(id);
    return await this.getAll();
  }

  public async unfriend(userId: string, friendId: string) {
    const friend = await this.findByConnectorAndFriend(userId, friendId);
    const friend2 = await this.findByConnectorAndFriend(friendId, userId);
    await this.delete(friend.id);
    await this.delete(friend2.id);
    return await this.getAll();
  }

  public friendToDto(friend: Friend) {
    let dto = new FriendDto();
    dto.id = friend.id;
    dto.connectorId = friend.connector.id;
    dto.connectorName = friend.connector.name;
    dto.friendId = friend.friend.id;
    dto.friendName = friend.friend.name;
    dto.status = RequestStatus[friend.status];
    return dto;
  }
}