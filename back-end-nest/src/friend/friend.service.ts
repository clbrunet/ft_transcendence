import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Friend from './friend.entity';
import User from '../user/user.entity';

import { FriendStatus } from './enum.friendStatus';
import { Status } from '../user/enum.status';

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

  public async create(friendOwnerId: string, friendId: string) {
    if (friendOwnerId === friendId) {
      throw new HttpException('User can not friend himself', HttpStatus.BAD_REQUEST);
    }
    const friendOwner = await this.userService.findByIdLazy(friendOwnerId);
    if (!friendOwner) {
      throw new HttpException('FriendOwner with this id does not exist', HttpStatus.NOT_FOUND);
    }
    const friend = await this.userService.findByIdLazy(friendId);
    if (!friend) {
      throw new HttpException('Friend with this id does not exist', HttpStatus.NOT_FOUND);
    }

    let friendObject = new Friend();
    friendObject.friendOwner = friendOwner;
    friendObject.friend = friend;
    friendObject.status = 0;
    let res;
    try {
      res = await this.friendRepo.save(friendObject);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Friend between those two users already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong while creating a friend', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let ret = [];
    ret.push(this.friendToDto(res));

    let friendObject2 = new Friend();
    friendObject2.friendOwner = friend;
    friendObject2.friend = friendOwner;
    friendObject2.status = 1;
    try {
      res = await this.friendRepo.save(friendObject2);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Friend relationship between those two users already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong while creating a friend', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    ret.push(this.friendToDto(res));
    return ret;
  }

  // Return all Friend Objects with all joined tables
  public async findAll() {
    return await this.friendRepo.find(
      {
        join: {
          alias: "friend",
          leftJoinAndSelect: {
            friendOwner: "friend.friendOwner",
            friendUser: "friend.friend",
          },
        },
      }    
    );
  }

  // Return all Friend Objects without any joined table
  public async findAllLazy() {
    return await this.friendRepo.find();
  }

  // Return all Friend Dtos
  public async getAllActiveUser(userId: string) {
    const res = await this.userRepo.findOne(userId,
      {
        relations: ['friendOwners', 'friendOwners.friendOwner', 'friendOwners.friend'],
      }
    );
    let dto = [];
    for (const friendOwner of res.friendOwners) {
      let friendDto: FriendDto = this.friendToDto(friendOwner);
      dto.push(friendDto);
    }
    return dto;  
  }

  public async getAll(userId: string) {
    const res = await this.userRepo.findOne(userId,
      {
        relations: ['friendOwners', 'friendOwners.friendOwner', 'friendOwners.friend'],
      }
    );
    let dto = [];
    for (const friendOwner of res.friendOwners) {
      if (friendOwner.status == 2) {
        let friendDto: FriendDto = this.friendToDto(friendOwner);
        dto.push(friendDto);
      }
    }
    return dto;  
  }

  // Return Friend Object with joined tables
  public async findById(id: string) {
    const friend = await this.friendRepo.findOne(id,
      {
        join: {
          alias: "friend",
          leftJoinAndSelect: {
            friendOwner: "friend.friendOwner",
            friendUser: "friend.friend",
          },
        },
      }    
    );
    if (friend) {
      return friend;
    }
    throw new HttpException('Friend with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Friend Object without any joined table
  public async findByIdLazy(id: string) {
    const friend = await this.friendRepo.findOne(id);
    if (friend) {
      return friend;
    }
    throw new HttpException('Friend with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Friend Object with joined table
  public async findByOwnerAndFriend(friendOwnerId: string, friendId: string) {
    const friendOwner = await this.userService.findByIdLazy(friendOwnerId);
    const friend = await this.userService.findByIdLazy(friendId);
    const friendObject = await this.friendRepo.findOne( { friendOwner, friend },
      {
        join: {
          alias: "friend",
          leftJoinAndSelect: {
            friendOwner: "friend.friendOwner",
            friendUser: "friend.friend",
          },
        },
      }
    );
    if (friendObject) {
      return friendObject;
    }
    throw new HttpException('Friend with this (friendOwnerId, friendId) does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Friend Object without any joined table
  public async findByOwnerAndFriendLazy(friendOwnerId: string, friendId: string) {
    const friendOwner = await this.userService.findByIdLazy(friendOwnerId);
    const friend = await this.userService.findByIdLazy(friendId);
    const friendObject = await this.friendRepo.findOne( { friendOwner, friend },
      {
        join: {
          alias: "friend",
          leftJoinAndSelect: {
            friendOwner: "friend.friendOwner",
            friendUser: "friend.friend",
          },
        },
      }
    );
    if (friendObject) {
      return friendObject;
    }
    throw new HttpException('Friend with this (friendOwnerId, friendId) does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Friend dto
  public async update(id: string, friendUpdateDto: FriendUpdateDto) {
    const res = await this.friendRepo.update(id, friendUpdateDto);
    if (res) {
      const friend = await this.findById(id);
      return this.friendToDto(friend);
    }
    throw new HttpException('Friend update failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  public async updateStatus(userId: string, friendId: string, status: number) {
    let friend = await this.findByOwnerAndFriendLazy(userId, friendId);
    if (friend.status === 0) {
      throw new HttpException('You have to wait for Friend to accept', HttpStatus.BAD_REQUEST);
    }
    if (friend.status === 2) {
      throw new HttpException('The request has already been accepted', HttpStatus.BAD_REQUEST);
    }
    let friendUpdateDto = new FriendUpdateDto();
    friendUpdateDto.status = status;
    await this.update(friend.id, friendUpdateDto);
    let res = await this.findById(friend.id);
    let ret = [];
    ret.push(this.friendToDto(res));

    let friend2 = await this.findByOwnerAndFriendLazy(friendId, userId);
    let friendUpdateDto2 = new FriendUpdateDto();
    friendUpdateDto2.status = status;
    await this.update(friend2.id, friendUpdateDto2);
    let res2 = await this.findById(friend2.id);
    ret.push(this.friendToDto(res2));

    return ret;
  }

  public async delete(id: string) {
    try {
      await this.findByIdLazy(id);
    }
    catch(error) {
      throw new HttpException('Friend with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.friendRepo.delete(id);
    return "Successfull Friend deletion";
  }

  public async reject(userId: string, friendId: string) {
    const friend = await this.findByOwnerAndFriendLazy(userId, friendId);
    if (friend.status == 0) {
      throw new HttpException('User can not reject a Friend he has sent', HttpStatus.BAD_REQUEST);      
    }
    const friend2 = await this.findByOwnerAndFriendLazy(friendId, userId);
    await this.delete(friend.id);
    await this.delete(friend2.id);
    return "Successfull Friend rejection";
  }

  public async unfriend(userId: string, friendId: string) {
    const friend = await this.findByOwnerAndFriendLazy(userId, friendId);
    if (friend.status == 1) {
      throw new HttpException('User can not unfriend before accepting', HttpStatus.BAD_REQUEST);
    }
    const friend2 = await this.findByOwnerAndFriendLazy(friendId, userId);
    await this.delete(friend.id);
    await this.delete(friend2.id);
    return "Successfull unfriend";
  }

  public friendToDto(friend: Friend) {
    let dto = new FriendDto();
    dto.id = friend.id;
    dto.friendOwnerId = friend.friendOwner.id;
    dto.friendOwnerName = friend.friendOwner.name;
    dto.friendId = friend.friend.id;
    dto.friendName = friend.friend.name;
    dto.requestStatus = FriendStatus[friend.status];
    if (friend.status == 2) {
      dto.friendStatus = Status[friend.friend.status];
    }
    else {
      dto.friendStatus = null;
    }
    return dto;
  }
}
