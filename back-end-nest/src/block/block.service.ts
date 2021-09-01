import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Block from './block.entity';
import User from '../user/user.entity';

import { BlockStatus } from './enum.blockStatus';

import { UserService } from '../user/user.service';

import { BlockDto } from './block.dto';
import { BlockUpdateDto } from './block.dto';


@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private readonly blockRepo: Repository<Block>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
  ) {}

  public async create(blockOwnerId: string, blockId: string) {
    if (blockOwnerId === blockId) {
      throw new HttpException('User can not block himself', HttpStatus.BAD_REQUEST);
    }
    const blockOwner = await this.userService.findByIdLazy(blockOwnerId);
    if (!blockOwner) {
      throw new HttpException('BlockOwner with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    const block = await this.userService.findByIdLazy(blockId);
    if (!block) {
      throw new HttpException('Block with this id does not exist', HttpStatus.BAD_REQUEST);
    }

    let blockObject = new Block();
    blockObject.blockOwner = blockOwner;
    blockObject.block = block;
    blockObject.status = 0;
    let res;
    try {
      res = await this.blockRepo.save(blockObject);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Block between those two users already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let ret = [];
    ret.push(this.blockToDto(res));

    let blockObject2 = new Block();
    blockObject2.blockOwner = block;
    blockObject2.block = blockOwner;
    blockObject2.status = 1;
    try {
      res = await this.blockRepo.save(blockObject2);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Block between those two users already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    ret.push(this.blockToDto(res));
    return ret;
  }

  public async getAll() {
    let res: Block[] = [];
    res = await this.blockRepo.find();
    let dto: BlockDto[] = [];
    res.forEach( block => {
      let blockDto: BlockDto = this.blockToDto(block);
      dto.push(blockDto);
    })
    return dto;    
  }

  public async getAllActiveUser(userId: string) {
    const res = await this.userService.findByIdBlockOwner(userId);
    let dto: BlockDto[] = [];
    for (const blockOwner of res.blockOwners) {
      const block = await this.findById(blockOwner.id);
      let blockDto: BlockDto = this.blockToDto(block);
      dto.push(blockDto);
    }
    return dto;  
  }

  // Return Block Object
  public async findById(id: string) {
    const block = await this.blockRepo.findOne(id);
    if (block) {
      return block;
    }
    throw new HttpException('Block with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Block Object
  public async findByOwnerAndBlock(blockOwnerId: string, blockId: string) {
    const blockOwner = await this.userService.findByIdLazy(blockOwnerId);
    const block = await this.userService.findByIdLazy(blockId);
    const blockObject = await this.blockRepo.findOne( { blockOwner, block } );
    if (blockObject) {
      return blockObject;
    }
    throw new HttpException('Block with this (blockOwnerId, blockId) does not exist', HttpStatus.NOT_FOUND);
  }

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('Block with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.blockRepo.delete(id);
    return;
  }

  public async unblock(userId: string, blockId: string) {
    const block = await this.findByOwnerAndBlock(userId, blockId);
    if (block.status == 1) {
      throw new HttpException('Only the blocker can unblock a Block', HttpStatus.NOT_FOUND);      
    }
    const block2 = await this.findByOwnerAndBlock(blockId, userId);
    await this.delete(block.id);
    await this.delete(block2.id);
    return await this.getAllActiveUser(userId);
  }

  public blockToDto(block: Block) {
    let dto = new BlockDto();
    dto.id = block.id;
    dto.blockOwnerId = block.blockOwner.id;
    dto.blockOwnerName = block.blockOwner.name;
    dto.blockId = block.block.id;
    dto.blockName = block.block.name;
    dto.status = BlockStatus[block.status];
    return dto;
  }
}