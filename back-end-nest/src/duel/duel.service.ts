import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Duel from './duel.entity';
import User from '../user/user.entity';

import { DuelStatus } from './enum.duelStatus';

import { UserService } from '../user/user.service';

import { DuelDto } from './duel.dto';
import { DuelUpdateDto } from './duel.dto';


@Injectable()
export class DuelService {
  constructor(
    @InjectRepository(Duel)
    private readonly duelRepo: Repository<Duel>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
  ) {}

  public async create(duelOwnerId: string, duelId: string) {
    if (duelOwnerId === duelId) {
      throw new HttpException('User can not duel himself', HttpStatus.BAD_REQUEST);
    }
    const duelOwner = await this.userService.findByIdLazy(duelOwnerId);
    if (!duelOwner) {
      throw new HttpException('DuelOwner with this id does not exist', HttpStatus.BAD_REQUEST);
    }
    const duel = await this.userService.findByIdLazy(duelId);
    if (!duel) {
      throw new HttpException('Duel with this id does not exist', HttpStatus.BAD_REQUEST);
    }

    let duelObject = new Duel();
    duelObject.duelOwner = duelOwner;
    duelObject.duel = duel;
    duelObject.status = 0;
    let res;
    try {
      res = await this.duelRepo.save(duelObject);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Duel between those two users already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong while creating a duel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let ret = [];
    ret.push(this.duelToDto(res));

    let duelObject2 = new Duel();
    duelObject2.duelOwner = duel;
    duelObject2.duel = duelOwner;
    duelObject2.status = 1;
    try {
      res = await this.duelRepo.save(duelObject2);
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Duel relationship between those two users already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong while creating a duel', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    ret.push(this.duelToDto(res));
    return ret;
  }

  // Return all Duel Objects with all joined tables
  public async findAll() {
    return await this.duelRepo.find(
      {
        join: {
          alias: "duel",
          leftJoinAndSelect: {
            duelOwner: "duel.duelOwner",
            duelUser: "duel.duel",
          },
        },
      }    
    );
  }

  // Return all Duel Objects without any joined table
  public async findAllLazy() {
    return await this.duelRepo.find();
  }

  // Return all Duel Dtos
  public async getAllActiveUser(userId: string) {
    const res = await this.userRepo.findOne(userId,
      {
        relations: ['duelOwners', 'duelOwners.duelOwner', 'duelOwners.duel'],
      }
    );
    let dto = [];
    for (const duelOwner of res.duelOwners) {
      let duelDto: DuelDto = this.duelToDto(duelOwner);
      dto.push(duelDto);
    }
    return dto;  
  }

  // Return Duel Object with joined tables
  public async findById(id: string) {
    const duel = await this.duelRepo.findOne(id,
      {
        join: {
          alias: "duel",
          leftJoinAndSelect: {
            duelOwner: "duel.duelOwner",
            duelUser: "duel.duel",
          },
        },
      }    
    );
    if (duel) {
      return duel;
    }
    throw new HttpException('Duel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Duel Object without any joined table
  public async findByIdLazy(id: string) {
    const duel = await this.duelRepo.findOne(id);
    if (duel) {
      return duel;
    }
    throw new HttpException('Duel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Duel Object with all joined tables
  public async findByOwnerAndDuel(duelOwnerId: string, duelId: string) {
    const duelOwner = await this.userService.findByIdLazy(duelOwnerId);
    const duel = await this.userService.findByIdLazy(duelId);
    const duelObject = await this.duelRepo.findOne( { duelOwner, duel },
      {
        join: {
          alias: "duel",
          leftJoinAndSelect: {
            duelOwner: "duel.duelOwner",
            duelUser: "duel.duel",
          },
        },
      }
    );
    if (duelObject) {
      return duelObject;
    }
    throw new HttpException('Duel with this (duelOwnerId, duelId) does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Duel Object without any joined table
  public async findByOwnerAndDuelLazy(duelOwnerId: string, duelId: string) {
    const duelOwner = await this.userService.findByIdLazy(duelOwnerId);
    const duel = await this.userService.findByIdLazy(duelId);
    const duelObject = await this.duelRepo.findOne( { duelOwner, duel } );
    if (duelObject) {
      return duelObject;
    }
    throw new HttpException('Duel with this (duelOwnerId, duelId) does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Duel dto
  public async update(id: string, duelUpdateDto: DuelUpdateDto) {
    const res = await this.duelRepo.update(id, duelUpdateDto);
    if (res) {
      const duel = await this.findById(id);
      return this.duelToDto(duel);
    }
    throw new HttpException('Duel update failed', HttpStatus.NOT_FOUND);
  }

  public async updateStatus(userId: string, duelId: string, status: number) {
    let duel = await this.findByOwnerAndDuelLazy(userId, duelId);
    if (duel.status === 0) {
      throw new HttpException('You have to wait for Duel to accept', HttpStatus.NOT_FOUND);
    }
    if (duel.status === 2) {
      throw new HttpException('The request has already been accepted', HttpStatus.NOT_FOUND);
    }
    let duelUpdateDto = new DuelUpdateDto();
    duelUpdateDto.status = status;
    await this.update(duel.id, duelUpdateDto);
    let res = await this.findById(duel.id);
    let ret = [];
    ret.push(this.duelToDto(res));

    let duel2 = await this.findByOwnerAndDuelLazy(duelId, userId);
    let duelUpdateDto2 = new DuelUpdateDto();
    duelUpdateDto2.status = status;
    await this.update(duel2.id, duelUpdateDto2);
    let res2 = await this.findById(duel2.id);
    ret.push(this.duelToDto(res2));

    return ret;
  }

  public async delete(id: string) {
    try {
      await this.findByIdLazy(id);
    }
    catch(error) {
      throw new HttpException('Duel with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.duelRepo.delete(id);
    return "Successfull Duel deletion";
  }

  public async reject(userId: string, duelId: string) {
    const duel = await this.findByOwnerAndDuel(userId, duelId);
    if (duel.status == 0) {
      throw new HttpException('User can not reject a Duel he has sent', HttpStatus.NOT_FOUND);      
    }
    const duel2 = await this.findByOwnerAndDuel(duelId, userId);
    await this.delete(duel.id);
    await this.delete(duel2.id);
    return "Successfull Duel rejection";
  }

  public async unduel(userId: string, duelId: string) {
    const duel = await this.findByOwnerAndDuelLazy(userId, duelId);
    if (duel.status == 1) {
      throw new HttpException('User can not unduel before accepting', HttpStatus.NOT_FOUND);      
    }
    const duel2 = await this.findByOwnerAndDuelLazy(duelId, userId);
    await this.delete(duel.id);
    await this.delete(duel2.id);
    return "Successfull unduel";
  }

  public duelToDto(duel: Duel) {
    let dto = new DuelDto();
    dto.id = duel.id;
    dto.duelOwnerId = duel.duelOwner.id;
    dto.duelOwnerName = duel.duelOwner.name;
    dto.duelId = duel.duel.id;
    dto.duelName = duel.duel.name;
    dto.status = DuelStatus[duel.status];
    return dto;
  }
}
