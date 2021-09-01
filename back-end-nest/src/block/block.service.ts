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

  async create(blockOwnerId: string, blockId: string) {
    const blockOwner = await this.userService.findById(blockOwnerId);
    if (!blockOwner) {
      throw new HttpException('BlockOwner with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    const block = await this.userService.findById(blockId);
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
        throw new HttpException('Block relationship between those two users already exists', HttpStatus.BAD_REQUEST);
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
    const res = await this.userService.findById(userId);
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
    const blockOwner = await this.userService.findById(blockOwnerId);
    const block = await this.userService.findById(blockId);
    const blockObject = await this.blockRepo.findOne( { blockOwner, block } );
    if (blockObject) {
      return blockObject;
    }
    throw new HttpException('Block with this (blockOwnerId, blockId) does not exist', HttpStatus.NOT_FOUND);
  }

  public async update(id: string, blockUpdateDto: BlockUpdateDto) {
    const res = await this.blockRepo.update(id, blockUpdateDto);
    if (res) {
      const block = await this.findById(id);
      return this.blockToDto(block);
    }
    throw new HttpException('Block update failed', HttpStatus.NOT_FOUND);
  }

  public async updateStatus(userId: string, blockId: string, status: number) {
    let block = await this.findByOwnerAndBlock(userId, blockId);
    if (block.status === 0) {
      throw new HttpException('You have to wait for Block to accept', HttpStatus.NOT_FOUND);
    }
    if (block.status === 2) {
      throw new HttpException('The request has already been accepted', HttpStatus.NOT_FOUND);
    }
    let blockUpdateDto = new BlockUpdateDto();
    blockUpdateDto.status = status;
    await this.update(block.id, blockUpdateDto);
    let res = await this.findById(block.id);
    let ret = [];
    ret.push(this.blockToDto(res));

    let block2 = await this.findByOwnerAndBlock(blockId, userId);
    let blockUpdateDto2 = new BlockUpdateDto();
    blockUpdateDto2.status = status;
    await this.update(block2.id, blockUpdateDto2);
    let res2 = await this.findById(block2.id);
    ret.push(this.blockToDto(res2));

    return ret;
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