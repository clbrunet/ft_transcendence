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
      throw new HttpException('BlockOwner with this id does not exist', HttpStatus.NOT_FOUND);
    }
    const block = await this.userService.findByIdLazy(blockId);
    if (!block) {
      throw new HttpException('Block with this id does not exist', HttpStatus.NOT_FOUND);
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
      throw new HttpException('Something went wrong while creating a block', HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException('Something went wrong while creating a block', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    ret.push(this.blockToDto(res));
    return ret;
  }

  // Return all Block Objects with all joined tables
  public async findAll() {
    return await this.blockRepo.find(
      {
        join: {
          alias: "block",
          leftJoinAndSelect: {
            blockOwner: "block.blockOwner",
            blockUser: "block.block",
          },
        },
      }    
    );
  }

  // Return all Block Objects without any joined table
  public async findAllLazy() {
    return await this.blockRepo.find();
  }

  // Return all Block Dtos
  public async getAllActiveUser(userId: string) {
    const blocks = await this.blockRepo.find(
      {
        join: {
          alias: "block",
          leftJoinAndSelect: {
            blockOwner: "block.blockOwner",
            blockUser: "block.block",
          },
        },
        where: {
          blockOwner: { id: userId }           
        }
      } 
    );
    let dto = [];
    for (const block of blocks) {
      let blockDto: BlockDto = this.blockToDto(block);
      dto.push(blockDto);
    }
    return dto;  
  }

  // Return array of UserId
  public async getArrayOfIdActiveUser(userId: string) {
    const blocks = await this.blockRepo.find(
      {
        join: {
          alias: "block",
          leftJoinAndSelect: {
            blockOwner: "block.blockOwner",
            blockUser: "block.block",
          },
        },
        where: {
          blockOwner: { id: userId }           
        }
      } 
    );
    let array = [];
    for (const block of blocks) {
      if (block.blockOwner.id == userId) {
        array.push(block.block.id);
      }
      else if (block.block.id == userId) {
        array.push(block.blockOwner.id);
      }
    }
    return array;  
  }

  // Return Block Object with joined tables
  public async findById(id: string) {
    const block = await this.blockRepo.findOne(id,
      {
        join: {
          alias: "block",
          leftJoinAndSelect: {
            blockOwner: "block.blockOwner",
            blockUser: "block.block",
          },
        },
      }
    );
    if (block) {
      return block;
    }
    throw new HttpException('Block with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Block Object without any joined table
  public async findByIdLazy(id: string) {
    const block = await this.blockRepo.findOne(id);
    if (block) {
      return block;
    }
    throw new HttpException('Block with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Block Object with all joined tables
  public async findByOwnerAndBlock(blockOwnerId: string, blockId: string) {
    const blockOwner = await this.userService.findByIdLazy(blockOwnerId);
    const block = await this.userService.findByIdLazy(blockId);
    const blockObject = await this.blockRepo.findOne( { blockOwner, block },
      {
        join: {
          alias: "block",
          leftJoinAndSelect: {
            blockOwner: "block.blockOwner",
            blockUser: "block.block",
          },
        },
      }
    );
    if (blockObject) {
      return blockObject;
    }
    throw new HttpException('Block with this (blockOwnerId, blockId) does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Block Object without any joined table
  public async findByOwnerAndBlockLazy(blockOwnerId: string, blockId: string) {
    const blockOwner = await this.userService.findByIdLazy(blockOwnerId);
    const block = await this.userService.findByIdLazy(blockId);
    const blockObject = await this.blockRepo.findOne( { blockOwner, block });
    if (blockObject) {
      return blockObject;
    }
    throw new HttpException('Block with this (blockOwnerId, blockId) does not exist', HttpStatus.NOT_FOUND);
  }

  public async delete(id: string) {
    try {
      await this.findByIdLazy(id);
    }
    catch(error) {
      throw new HttpException('Block with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.blockRepo.delete(id);
    return "Successfull Block deletion";
  }

  public async unblock(userId: string, blockId: string) {
    const block = await this.findByOwnerAndBlockLazy(userId, blockId);
    if (block.status == 1) {
      throw new HttpException('Only the blocker can unblock a Block', HttpStatus.BAD_REQUEST);      
    }
    const block2 = await this.findByOwnerAndBlockLazy(blockId, userId);
    await this.delete(block.id);
    await this.delete(block2.id);
    return "Successfull unblock";
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
