import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, getConnection, getManager } from 'typeorm';

import Message from './message.entity';
import Participant from '../participant/participant.entity';

import { ParticipantService } from '../participant/participant.service';

import { MessageCreationDto } from './message.dto';
import { MessageDto } from './message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,

    private readonly participantService: ParticipantService,
  ) {}

  async create(data: MessageCreationDto) {
    let message = new Message();
    const author = await this.participantService.findById(data.authorId);
    if (author) {
      message.author = author;
      message.content = data.content;
      const res = await this.messageRepo.save(message);
      return this.messageToDto(res);
    }
    throw new HttpException('Author with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async getAll() {
    let res: Message[] = [];
    res = await this.messageRepo.find();
    let dto: MessageDto[] = [];
    res.forEach( message => {
      let messageDto: MessageDto = this.messageToDto(message);
      dto.push(messageDto);
    })
    return dto;    
  }

  // Hacky but could not apply .WHERE on 3-level joined tables
  public async getAllInChannel(channelId: string) {
    const rawMessages = await getRepository(Message)
    .createQueryBuilder("message")
    .leftJoinAndSelect("message.author", "participant")
    .leftJoinAndSelect("participant.channel", "channel")
    //.where("message.author.channel.id = :channelId", { channelId })
    .getRawMany();
    let dto: MessageDto[] = [];
    for await (const rawMessage of rawMessages) {
      if (rawMessage.channel_id == channelId) {
        let message = await this.findById(rawMessage.message_id);
        let messageDto: MessageDto = this.messageToDto(message);
        dto.push(messageDto);
      }
    }
    return dto;
  }

  // Return Message Dto 
  public async getById(id: string) {
    const message = await this.messageRepo.findOne(id);
    if (message) {
      return this.messageToDto(message);
    }
    throw new HttpException('Message with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Message Object
  public async findById(id: string) {
    const message = await this.messageRepo.findOne(id);
    if (message) {
      return message;
    }
    throw new HttpException('Message with this id does not exist', HttpStatus.NOT_FOUND);
  }

  public async delete(id: string) {
    try {
      await this.findById(id);
    }
    catch(error) {
      throw new HttpException('Message with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.messageRepo.delete(id);
    return await this.getAll();
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
    return dto;
  }
}
