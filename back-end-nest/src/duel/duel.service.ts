import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Duel from './duel.entity';
import User from '../user/user.entity';

import { DuelStatus } from './enum.duelStatus';

import { UserService } from '../user/user.service';
import { QueueService } from '../queue/queue.service';
import { GameService } from '../game/game.service';
import { PlayerService } from '../player/player.service';
import { ChannelService } from '../channel/channel.service';
import { ParticipantService } from '../participant/participant.service';
import { MessageService } from '../message/message.service';

import { DuelDto } from './duel.dto';
import { DuelUpdateDto } from './duel.dto';
import { UserUpdateDto } from '../user/user.dto';
import { ChannelDirectCreationDto } from '../channel/channel.dto';
import { MessageCreationDto } from '../message/message.dto';
import { MessageUpdateDto } from '../message/message.dto';


@Injectable()
export class DuelService {
  constructor(
    @InjectRepository(Duel)
    private readonly duelRepo: Repository<Duel>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
    private readonly queueService: QueueService,
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
    private readonly channelService: ChannelService,
    private readonly participantService: ParticipantService,
    private readonly messageService: MessageService,
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
    let ret: DuelDto[] = [];
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
    await this.introductionMessage(duelOwnerId, duelId, duelObject.id);
    return ret;
  }

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

  public async findAllLazy() {
    return await this.duelRepo.find();
  }

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

  public async findByIdLazy(id: string) {
    const duel = await this.duelRepo.findOne(id);
    if (duel) {
      return duel;
    }
    throw new HttpException('Duel with this id does not exist', HttpStatus.NOT_FOUND);
  }

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

  public async findByOwnerAndDuelLazy(duelOwnerId: string, duelId: string) {
    const duelOwner = await this.userService.findByIdLazy(duelOwnerId);
    const duel = await this.userService.findByIdLazy(duelId);
    const duelObject = await this.duelRepo.findOne( { duelOwner, duel } );
    if (duelObject) {
      return duelObject;
    }
    throw new HttpException('Duel with this (duelOwnerId, duelId) does not exist', HttpStatus.NOT_FOUND);
  }

  public async update(id: string, duelUpdateDto: DuelUpdateDto) {
    const res = await this.duelRepo.update(id, duelUpdateDto);
    if (res) {
      const duel = await this.findById(id);
      return this.duelToDto(duel);
    }
    throw new HttpException('Duel update failed', HttpStatus.NOT_FOUND);
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

  public async go(userId: string, duelId: string) {
    let duel1 = await this.findByOwnerAndDuel(userId, duelId);
    let duel2 = await this.findByOwnerAndDuel(duelId, userId);
    while (duel2 && duel2.status == 1) { 
      duel2 = await this.duelRepo.findOne(duel2.id);
    }
    if (!duel2) {
      return "Successfull unduel";
    }
    if (duel2.status == 3) {
      await this.delete(duel1.id);
      await this.delete(duel2.id);
      return "Duel has been rejected";
    }
    if (duel2.status == 2) {
      const duelOwner = await this.userService.findByIdLazy(userId);
      const duel = await this.userService.findByIdLazy(duelId);
      if (duelOwner.status == 0) {
        return "Duel cancelled since the active User is offline";         
      }
      if (duelOwner.status == 2) {
        return "Duel cancelled since the active User is already in-game";         
      }
      if (await this.queueService.inQueue(userId)) {
        const duelOwner = await this.userService.findByIdQueuer(userId);
        await this.queueService.delete(duelOwner.queuers[0].id);
      }
      if (await this.queueService.inQueue(duelId)) {
        const duel = await this.userService.findByIdQueuer(duelId);
        await this.queueService.delete(duel.queuers[0].id);
      }
      const game = await this.gameService.matchByIdObject(userId, duelId, 5);
      let duelUpdateDto = new DuelUpdateDto();
      duelUpdateDto.gameId = game.id;
      await this.update(duel1.id, duelUpdateDto);
      await this.update(duel2.id, duelUpdateDto);
      let userUpdateDto = new UserUpdateDto();
      userUpdateDto.status = 2;
      await this.userService.update(userId, userUpdateDto);
      await this.userService.update(duelId, userUpdateDto);
      return this.gameService.gameToDto(game);
    }
  }

  public async accept(userId: string, duelId: string) {
    let duel1 = await this.findByOwnerAndDuel(userId, duelId);
    if (duel1.status == 0) {
      throw new HttpException('User can not accept a Duel he has sent', HttpStatus.NOT_FOUND);      
    }
    if (duel1.status == 2) {
      throw new HttpException('Duel has already been accepted', HttpStatus.NOT_FOUND);      
    }
    if (duel1.status == 3) {
      throw new HttpException('Duel has already been rejected', HttpStatus.NOT_FOUND);      
    }
    const duel2 = await this.findByOwnerAndDuel(duelId, userId);

    let duelUpdateDto = new DuelUpdateDto();
    duelUpdateDto.status = 2;
    await this.update(duel2.id, duelUpdateDto);
    await this.update(duel1.id, duelUpdateDto);

    let duel = await this.userService.findByIdLazy(duelId);
    while (!duel1.gameId && duel.status == 1) {
      duel1 = await this.findByOwnerAndDuel(userId, duelId);
      duel = await this.userService.findByIdLazy(duelId);
    }

    await this.delete(duel1.id);
    await this.delete(duel2.id);
    const messages = await this.messageService.findByDuelIdLazy(duel2.id);
    if (messages.length != 1) {
      throw new HttpException('No or more than one Message with this duelId attribute', HttpStatus.NOT_FOUND);   
    }
    let messageUpdateDto = new MessageUpdateDto();
    messageUpdateDto.button = false;
    await this.messageService.update(messages[0].id, messageUpdateDto);

    if (duel.status === 0) {
      return "Duel cancelled since the other User is offline";   
    }
    if (duel.status === 2) {
      return "Duel cancelled since the other User is already in-game"; 
    } 
    const game = await this.gameService.findById(duel1.gameId);   
    return this.gameService.gameToDto(game);
  }

  public async reject(userId: string, duelId: string) {
    const duel1 = await this.findByOwnerAndDuel(userId, duelId);
    if (duel1.status == 0) {
      throw new HttpException('User can not reject a Duel he has sent', HttpStatus.NOT_FOUND);      
    }
    if (duel1.status == 2) {
      throw new HttpException('Duel has already been accepted', HttpStatus.NOT_FOUND);      
    }
    if (duel1.status == 3) {
      throw new HttpException('Duel has already been rejected', HttpStatus.NOT_FOUND);      
    }
    const duel2 = await this.findByOwnerAndDuel(duelId, userId);

    let duelUpdateDto = new DuelUpdateDto();
    duelUpdateDto.status = 3;
    await this.update(duel2.id, duelUpdateDto);
    await this.update(duel1.id, duelUpdateDto);

    const messages = await this.messageService.findByDuelIdLazy(duel2.id);
    if (messages.length != 1) {
      throw new HttpException('No or more than one Message with this duelId attribute', HttpStatus.NOT_FOUND);   
    }
    let messageUpdateDto = new MessageUpdateDto();
    messageUpdateDto.button = false;
    await this.messageService.update(messages[0].id, messageUpdateDto);

    return "Duel has been rejected";
  }

  public async unduel(userId: string, duelId: string) {
    const duel1 = await this.findByOwnerAndDuelLazy(userId, duelId);
    if (duel1.status == 1) {
      throw new HttpException('User can not unduel before accepting', HttpStatus.NOT_FOUND);      
    }
    const duel2 = await this.findByOwnerAndDuelLazy(duelId, userId);

    await this.delete(duel1.id);
    await this.delete(duel2.id);

    const messages = await this.messageService.findByDuelIdLazy(duel1.id);
    if (messages.length != 1) {
      throw new HttpException('No or more than one Message with this duelId attribute', HttpStatus.NOT_FOUND);   
    }
    let messageUpdateDto = new MessageUpdateDto();
    messageUpdateDto.button = false;
    await this.messageService.update(messages[0].id, messageUpdateDto);

    return "Successfull unduel";
  }

  public async introductionMessage(duelOwnerId: string, duelId: string, duelObjectId: string) {
    let channelDirectCreationDto = new ChannelDirectCreationDto();
    channelDirectCreationDto.userId1 = duelOwnerId;
    channelDirectCreationDto.userId2 = duelId;    
    const direct = await this.channelService.goDirectActiveUser(channelDirectCreationDto);
    const author = await this.participantService.findByUserAndChannelLazy(duelOwnerId, direct.id);
    let messageCreationDto = new MessageCreationDto();
    messageCreationDto.authorId = author.id;
    messageCreationDto.content = "I invited you to a game, will you take the challenge?";
    messageCreationDto.button = true;
    messageCreationDto.duelId = duelObjectId;
    return await this.messageService.create(messageCreationDto);
  }

  public duelToDto(duel: Duel) {
    let dto = new DuelDto();
    dto.id = duel.id;
    dto.duelOwnerId = duel.duelOwner.id;
    dto.duelOwnerName = duel.duelOwner.name;
    dto.duelId = duel.duel.id;
    dto.duelName = duel.duel.name;
    dto.status = DuelStatus[duel.status];
    dto.gameId = duel.gameId;
    return dto;
  }
}
