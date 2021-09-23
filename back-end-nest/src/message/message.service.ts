import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, getConnection, getManager } from 'typeorm';

import Message from './message.entity';
import Participant from '../participant/participant.entity';

import { ParticipantService } from '../participant/participant.service';
import { ChannelService } from '../channel/channel.service';

import { MessageCreationDto } from './message.dto';
import { MessageUpdateDto } from './message.dto';
import { MessageDto } from './message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,

    private readonly participantService: ParticipantService,
    private readonly channelService: ChannelService,
  ) {}

  public async create(data: MessageCreationDto) {
    let message = new Message();
    const author = await this.participantRepo.findOne(data.authorId);
    if (author) {
      message.author = author;
      message.content = data.content;
      if (data.button) {
        message.button = data.button;
      }
      if (data.duelId) {
        message.duelId = data.duelId;
      }
      return await this.messageRepo.save(message);
    }
    throw new HttpException('Author with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async createActiveUser(userId: string, channelId: string, content: string) {
    if (!(await this.participantService.isParticipant(userId, channelId))) {
      throw new HttpException('User is not a Participant to this Channel', HttpStatus.BAD_REQUEST);
    }
    if (!(await this.participantService.isAuthorized(userId, channelId))) {
      throw new HttpException('User is not authorized for this Channel', HttpStatus.BAD_REQUEST);
    }
    if (await this.participantService.isBan(userId, channelId)) {
      throw new HttpException('User is banned for this Channel', HttpStatus.BAD_REQUEST);
    }
    if (await this.participantService.isMute(userId, channelId)) {
      throw new HttpException('User is muted for this Channel', HttpStatus.BAD_REQUEST);
    }
    let message = new Message();
    const author = await this.participantService.findByUserAndChannelUserChannel(userId, channelId);
    if (author) {
      message.author = author;
      message.content = content;
      const res = await this.messageRepo.save(message);
      return this.messageToDto(res);
    }
    throw new HttpException('Author with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findAllLazy() {
    return await this.messageRepo.find();
  }

  public async getAllInChannelActiveUser(userId: string, channelId: string) {
    if (!await this.channelService.isPublic(channelId)) {
      if (!(await this.participantService.isParticipant(userId, channelId))) {
        throw new HttpException('Channel is not Public or User is not a Participant to this Channel', HttpStatus.BAD_REQUEST);
      }
      if (!(await this.participantService.isAuthorized(userId, channelId))) {
        throw new HttpException('User is not authorized for this Channel', HttpStatus.BAD_REQUEST);
      }
      if (await this.participantService.isBan(userId, channelId)) {
        throw new HttpException('Channel is not Public or User is banned for this Channel', HttpStatus.BAD_REQUEST);
      }
    }
    const messages = await this.messageRepo.find (
      {
        relations: ['author', 'author.user', 'author.channel'],
        where: {
          author: { channel: {id: channelId } },
        },   
      }
    );
    let dto = [];
    for (const message of messages) {
      let messageDto: MessageDto = this.messageToDto(message);
      dto.push(messageDto);
    }
    return dto;
  }

  public async findByIdLazy(id: string) {
    const message = await this.messageRepo.findOne(id);
    if (message) {
      return message;
    }
    throw new HttpException('Message with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByDuelIdLazy(duelId: string) {
    const messages = await this.messageRepo.find(
      {
        where: {
          duelId: duelId, 
        },
      }
    );
    return messages;
  }

  public async getById(id: string) {
    const message = await this.messageRepo.findOne(id,
      {
        relations: ['author', 'author.user', 'author.channel']
      }
    );
    if (message) {
      return this.messageToDto(message);
    }
    throw new HttpException('Message with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async update(id: string, messageUpdateDto: MessageUpdateDto) {
    const res = await this.messageRepo.update(id, messageUpdateDto);
    if (res) {
      const message = await this.messageRepo.findOne(
        {
          relations: ['author', 'author.user', 'author.channel'],
        }
      );
      return this.messageToDto(message);
    }
    throw new HttpException('Message update failed', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  public async delete(id: string) {
    try {
      await this.findByIdLazy(id);
    }
    catch(error) {
      throw new HttpException('Message with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.messageRepo.delete(id);
    return 'Successful Message deletion';
  }

  public messageToDto(message: Message) {
    let dto = new MessageDto();
    dto.id = message.id;
    dto.userId = message.author.user.id;
    dto.userName = message.author.user.name;
    dto.channelId = message.author.channel.id;
    dto.channelName = message.author.channel.name;
    dto.createDateTime = message.createDateTime;
    dto.content = message.content;
    dto.button = message.button;
    dto.duelId = message.duelId;
    return dto;
  }
}
