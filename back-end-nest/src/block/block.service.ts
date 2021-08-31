import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Block from './block.entity';
import User from '../user/user.entity';

import { UserService } from '../user/user.service';

import { BlockDto } from './block.dto';


@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private readonly blockRepo: Repository<Block>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
  ) {}

  async create(blockConnectorId: string, blockId: string) {
    const blockConnector = await this.userService.findById(blockConnectorId);
    if (!blockConnector) {
      throw new HttpException('BlockConnector with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    const block = await this.userService.findById(blockId);
    if (!block) {
      throw new HttpException('Block with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    let blockObject = new Block();
    blockObject.blockConnector = blockConnector;
    blockObject.block = block;
    let res;
    try {
      res = await this.blockRepo.save(blockObject);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('This user has already been blocked', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return await this.blockToDto(res);
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
    for (const blockConnector of res.blockConnectors) {
      const block = await this.findById(blockConnector.id);
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
  public async findByConnectorAndBlock(blockConnectorId: string, blockId: string) {
    const blockConnector = await this.userService.findById(blockConnectorId);
    const block = await this.userService.findById(blockId);
    const blockObject = await this.blockRepo.findOne( { blockConnector, block } );
    if (blockObject) {
      return blockObject;
    }
    throw new HttpException('Block with this (blockConnectorId, blockId) does not exist', HttpStatus.NOT_FOUND);
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
    const block = await this.findByConnectorAndBlock(userId, blockId);
    await this.delete(block.id);
    return await this.getAllActiveUser(userId);
  }

  public blockToDto(block: Block) {
    let dto = new BlockDto();
    dto.id = block.id;
    dto.blockConnectorId = block.blockConnector.id;
    dto.blockConnectorName = block.blockConnector.name;
    dto.blockId = block.block.id;
    dto.blockName = block.block.name;
    return dto;
  }
}