import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';

import { ChannelStatus } from './enum.channelStatus';

import { UserService } from '../user/user.service';
import { ParticipantService } from '../participant/participant.service';
import { BlockService } from '../block/block.service';

import { ChannelCreationDto } from './channel.dto';
import { ChannelDirectCreationDto } from './channel.dto';
import { ParticipantCreationDto } from '../participant/participant.dto';
import { ChannelUpdateDto } from './channel.dto';
import { ParticipantUpdateDto } from '../participant/participant.dto';
import { AuthorizationDto } from './channel.dto';
import { MuteBanDto } from './channel.dto';
import { ChannelDto } from './channel.dto';
import { ParticipantForChannelDto } from '../participant/participant.dto';
import { ParticipantForChannelDirectDto } from '../participant/participant.dto';
import { ChannelDtoActiveUser } from './channel.dto';
import { ChannelDtoLazy } from './channel.dto';
import { ChannelDtoDirect } from './channel.dto';
import { CandidateDto } from './channel.dto';


@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
    @Inject(forwardRef(() => ParticipantService))
    private readonly participantService: ParticipantService,
    private readonly blockService: BlockService,
  ) {}

  public async create(channelCreationDto: ChannelCreationDto) {
    let hashedPassword;
    if (channelCreationDto.status == 2) {
      hashedPassword = await bcrypt.hash(channelCreationDto.password, 10);
    } else {
      hashedPassword = null; 
    }    
    let newChannel;
    try {
      newChannel = this.channelRepo.create(channelCreationDto);
      const owner = await this.userService.findByIdLazy(channelCreationDto.ownerId);
      newChannel.owner = owner;
      newChannel = await this.channelRepo.save({
        ...newChannel,
        password: hashedPassword
      });
    }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Channel with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    let participantCreationDto = new ParticipantCreationDto();
    participantCreationDto.userId = newChannel.owner.id;
    participantCreationDto.channelId = newChannel.id;
    participantCreationDto.admin = true;
    participantCreationDto.authorized = true;
    await this.participantService.create(participantCreationDto);
    if (channelCreationDto.status == 0) {
      this.addAllUser(newChannel.id);
    }
    return this.channelToDtoLazy(newChannel);
  }

  private async addAllUser(channelId: string) {
    const channel = await this.findByIdLazy(channelId);
    const users = await this.userService.findAllLazy();
    for (const user of users) {
      const participant = await this.participantRepo.findOne( { user, channel } );
      if (!participant) {
        let participantCreationDto = new ParticipantCreationDto();
        participantCreationDto.userId = user.id;
        participantCreationDto.channelId = channelId;
        await this.participantService.create(participantCreationDto);
      }
      else if (participant.left) {
        await this.participantService.updateLeft(participant.id, false);
      }
    }
  }

  public async findAll(direct: boolean) {
    return await this.channelRepo.find(
      {
        relations: ['participants'],
        join: {
          alias: "channel",
          leftJoinAndSelect: {
            owner: "channel.owner",
          },
        },
        where: {
          direct: direct,
        },
      }     
    );
  }

  public async getAllActiveUser(userId: string) {
    const channels = await this.findAll(false);
    let dto = [];
    for (const channel of channels) {
      if (channel.status == 0 || await this.participantService.isParticipant(userId, channel.id)) {
        const channelDtoActiveUser = await this.channelToDtoActiveUser(userId, channel);
        dto.push(channelDtoActiveUser);
      }
    }
    return dto;    
  }

  public async findById(id: string) {
    const channel = await this.channelRepo.findOne(id,
      {
        relations: ['participants'],
        join: {
          alias: "channel",
          leftJoinAndSelect: {
            owner: "channel.owner",
          },
        },
      }
    );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this (id, direct) does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByIdParticipant(id: string) {
    const channel = await this.channelRepo.findOne(id,
      {
        relations: ['participants'],
      }
    );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this (id, direct) does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByIdOwner(id: string) {
    const channel = await this.channelRepo.findOne(id,
      {
        join: {
          alias: "channel",
          leftJoinAndSelect: {
            owner: "channel.owner",
          },
        },
      }
    );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this (id, direct) does not exist', HttpStatus.NOT_FOUND);
  }

  public async findByIdLazy(id: string) {
    const channel = await this.channelRepo.findOne(id);
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this (id, direct) does not exist', HttpStatus.NOT_FOUND);
  } 

  public async findByName(name: string) {
    const channel = await this.channelRepo.findOne( { name },
      {
        relations: ['participants', 'participants.user'],
      }
    );
    if (channel) {
      return channel;
    }
    return;
  } 

  public async findByNameLazy(name: string) {
    const channel = await this.channelRepo.findOne( { name } );
    if (channel) {
      return channel;
    }
    return;
  } 

  public async getById(id: string) {
    const channel = await this.findById(id);
    return await this.channelToDto(channel);
  } 

  public async update(id: string, channelUpdateDto: ChannelUpdateDto) {
    const res = await this.channelRepo.update(id, channelUpdateDto);
    if (res) {
      return this.channelToDtoLazy(await this.findByIdOwner(id));
    }
    throw new HttpException('Channel update failed', HttpStatus.NOT_FOUND);
  }

  public async getOwnerCandidateActiveUser(userId: string, id: string) {
    const channel = await this.findByIdOwner(id);
    if (channel.owner.id !== userId) {
      throw new HttpException('User is not the Channel owner', HttpStatus.NOT_FOUND);
    }
    const candidates = await this.participantRepo.find(
      {
        relations: ['user', 'channel', 'channel.owner'],
        where: {
          channel: { id: id},
          user: { id: Not(channel.owner.id) },
        }
      }   
    );
    let dto = [];
    for (const candidate of candidates) {
      const candidateDto: CandidateDto = this.candidateToDto(candidate);
      dto.push(candidateDto)
    }
    return dto;
  }

  public async changeOwnerActiveUser(userId: string, id: string, newOwnerId: string) {
    const channel = await this.findByIdOwner(id);
    if (channel.owner.id !== userId) {
      throw new HttpException('User is not the Channel owner', HttpStatus.NOT_FOUND);
    }
    if (!await this.participantService.isParticipant(newOwnerId, id)) {
      throw new HttpException('New owner is not a Participant of this Channel', HttpStatus.NOT_FOUND);
    }
    let channelUpdateDto = new ChannelUpdateDto();
    channelUpdateDto.owner = await this.userService.findByIdLazy(newOwnerId);
    const res = await this.channelRepo.update(id, channelUpdateDto);
    const newOwnerParticipant = await this.participantService.findByUserAndChannelLazy(newOwnerId, id);
    await this.participantService.updateAdmin(newOwnerParticipant.id, true);
    await this.participantService.updateAuthorized(newOwnerParticipant.id, true);
    if (res) {
      return this.channelToDtoLazy(await this.findByIdOwner(id));
    }
    throw new HttpException('Channel update failed', HttpStatus.NOT_FOUND);
  }

  public async changeStatusActiveUser(userId: string, id: string, channelUpdateDto: ChannelUpdateDto) {
    const channel = await this.findById(id);
    if (channel.owner.id !== userId) {
      throw new HttpException('User is not the Channel owner', HttpStatus.NOT_FOUND);
    }
    if (channelUpdateDto.status === 0) {
      await this.addAllUser(id);
      for (const participant of channel.participants) {
        this.participantService.updateAuthorized(participant.id, true);
      }
      channelUpdateDto.password = null;
      return this.update(id, channelUpdateDto);
    }
    else if (channelUpdateDto.status === 1) {
      for (const participant of channel.participants) {
        this.participantService.updateAuthorized(participant.id, true);
      }
      channelUpdateDto.password = null;
      return this.update(id, channelUpdateDto);
    }
    else if (channelUpdateDto.status === 2) {
      for (const participant of channel.participants) {
        this.participantService.updateAuthorized(participant.id, false);
      }
      const participantActiveUser = await this.participantService.findByUserAndChannelLazy(userId, id);
      this.participantService.updateAuthorized(participantActiveUser.id, true);
      channelUpdateDto.password = await bcrypt.hash(channelUpdateDto.password, 10);
      return this.update(id, channelUpdateDto);
    }
  }

  public async updateAdminActiveUser(userId: string, id: string, newAdminId: string, toogle: boolean) {
    const channel = await this.findByIdOwner(id);
    if (channel.owner.id !== userId) {
      throw new HttpException('User is not the Channel owner', HttpStatus.NOT_FOUND);
    }
    if (!await this.participantService.isParticipant(newAdminId, id)) {
      throw new HttpException('New admin is not a Participant of this Channel', HttpStatus.NOT_FOUND);
    }
    const newAdmin = await this.participantService.findByUserAndChannelLazy(newAdminId, id);
    return await this.participantService.updateAdmin(newAdmin.id, toogle);
  }

  public async getParticipantCandidateActiveUser(userId: string, id: string) {
    const channel = await this.findByIdOwner(id);
    if (!await this.participantService.isParticipant(userId, id)) {
      throw new HttpException('User is not a Participant of this Channel', HttpStatus.NOT_FOUND);
    }
    const participantActiveUser = await this.participantService.findByUserAndChannelLazy(userId, id);
    if (!participantActiveUser.admin) {
      throw new HttpException('User is not an admin of this Channel', HttpStatus.NOT_FOUND);
    }
    const users = await this.userRepo.find();
    let candidates = [];
    for (const user of users) {
      if (!(await this.participantService.isParticipant(user.id, id))) {
        candidates.push(user);
      }
    }
    let dto = [];
    for (const candidate of candidates) {
      const candidateDto: CandidateDto = this.candidateToDto2(candidate);
      dto.push(candidateDto)
    }
    return dto;
  }

  public async addParticipantActiveUser(userId: string, participantCreationDto: ParticipantCreationDto) {
    if (!await this.participantService.isParticipant(userId, participantCreationDto.channelId)) {
      throw new HttpException('User is not a Participant of this Channel', HttpStatus.NOT_FOUND);
    }
    const participantActiveUser = await this.participantService.findByUserAndChannelLazy(userId, participantCreationDto.channelId);
    if (!participantActiveUser.admin) {
      throw new HttpException('User is not an admin of this Channel', HttpStatus.NOT_FOUND);
    }
    if (await this.participantService.isParticipant(participantCreationDto.userId, participantCreationDto.channelId)) {
      throw new HttpException('User can not add an existing Participant to the channel', HttpStatus.NOT_FOUND);
    }   
    let newParticipant;
    try {
      newParticipant = await this.participantService.findByUserAndChannelLazy(participantCreationDto.userId, participantCreationDto.channelId);
    }
    catch(error) {
      return await this.participantService.create(participantCreationDto);
    }
    return await this.participantService.updateLeft(newParticipant.id, false);
  }

  public async muteActiveUser(userId: string, muteBanDto: MuteBanDto) {
    const channel = await this.findByIdLazy(muteBanDto.channelId);
    if (!await this.participantService.isParticipant(userId, muteBanDto.channelId)) {
      throw new HttpException('User is not a Participant of this Channel', HttpStatus.NOT_FOUND);
    }
    const participantActiveUser = await this.participantService.findByUserAndChannelLazy(userId, muteBanDto.channelId);
    if (!participantActiveUser.admin) {
      throw new HttpException('User is not an admin of this Channel', HttpStatus.NOT_FOUND);
    }
    const mutedParticipant = await this.participantService.findByUserAndChannelLazy(muteBanDto.userId, muteBanDto.channelId);
    if (muteBanDto.always == true) {
      return this.participantService.updateMute(mutedParticipant.id, true, 0);
    }
    else {
      return this.participantService.updateMute(mutedParticipant.id, false, muteBanDto.minutes);
    }
  }

  public async banActiveUser(userId: string, muteBanDto: MuteBanDto) {
    if (!await this.participantService.isParticipant(userId, muteBanDto.channelId)) {
      throw new HttpException('User is not a Participant of this Channel', HttpStatus.NOT_FOUND);
    }
    const participantActiveUser = await this.participantService.findByUserAndChannelLazy(userId, muteBanDto.channelId);
    if (!participantActiveUser.admin) {
      throw new HttpException('User is not an admin of this Channel', HttpStatus.NOT_FOUND);
    }
    const banedParticipant = await this.participantService.findByUserAndChannelLazy(muteBanDto.userId, muteBanDto.channelId);
    if (muteBanDto.always == true) {
      return this.participantService.updateBan(banedParticipant.id, true, 0);
    }
    else {
      return this.participantService.updateBan(banedParticipant.id, false, muteBanDto.minutes);
    }
  }

  public async authorizeActiveUser(userId: string, authorizationDto: AuthorizationDto) {
    const channel = await this.findByIdLazy(authorizationDto.channelId);
    if (!await this.participantService.isParticipant(userId, authorizationDto.channelId)) {
      throw new HttpException('User is not a Participant of this Channel', HttpStatus.NOT_FOUND);
    }    
    const participantActiveUser = await this.participantService.findByUserAndChannelLazy(userId, authorizationDto.channelId);
    if (participantActiveUser.authorized) {
      throw new HttpException('User is already authorized for this protected Channel', HttpStatus.NOT_FOUND);
    }
    const isPasswordMatching = await bcrypt.compare(authorizationDto.password, channel.password);
    if (!isPasswordMatching) {
      throw new HttpException('Wrong email or password provided', HttpStatus.BAD_REQUEST);
    }
    return this.participantService.updateAuthorized(participantActiveUser.id, true);
   }

  public async leaveActiveUser(userId: string, id: string) {
    const channel = await this.findByIdOwner(id);
    if (!await this.participantService.isParticipant(userId, id)) {
      throw new HttpException('User is not a Participant of this Channel', HttpStatus.NOT_FOUND);
    }
    if (channel.owner.id === userId) {
      throw new HttpException('The owner can not leave the channel', HttpStatus.NOT_FOUND);
    }
    const participantActiveUser = await this.participantService.findByUserAndChannelLazy(userId, id);
    return this.participantService.updateLeft(participantActiveUser.id, true);
  }

  public async delete(id: string) {
    try {
      await this.findByIdLazy(id);
    }
    catch(error) {
      throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.channelRepo.delete(id);
    return "Successful Channel deletion";
  }

  public async isPublic(id: string) {
    const channel = await this.findByIdLazy(id);
    if (channel.status === 0) {
      return true;
    }
    return false;
  }


  // <------------- FUNCTIONS DIRECT CHANNELS ------------->

  async createDirect(channelDirectCreationDto: ChannelDirectCreationDto) {
    let direct = new Channel();
    const user1 = await this.userService.findByIdLazy(channelDirectCreationDto.userId1);
    const user2 = await this.userService.findByIdLazy(channelDirectCreationDto.userId2);
    direct.name = user1.name + "DirectTo" + user2.name;
    direct.direct = true;
    direct.status = 1;
    direct.owner = user1;
    try {
      direct = await this.channelRepo.save(direct);
      }
    catch(error) {
      if (error?.code === '23505') {
        throw new HttpException('Channel with that name already exists', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let participantCreationDto1 = new ParticipantCreationDto();
    participantCreationDto1.userId = channelDirectCreationDto.userId1;
    participantCreationDto1.channelId = direct.id;
    participantCreationDto1.authorized = true;
    await this.participantService.create(participantCreationDto1);

    let participantCreationDto2 = new ParticipantCreationDto();
    participantCreationDto2.userId = channelDirectCreationDto.userId2;
    participantCreationDto2.channelId = direct.id;
    participantCreationDto2.authorized = true;
    await this.participantService.create(participantCreationDto2);

    return await this.channelRepo.findOne(direct.id,
      {
        relations: ['participants', 'participants.user'],
      } 
    );
  }

  private getSecondParticipant(userId: string, participants: Participant[]) {
    for (const participant of participants) {
      if (participant.user.id !== userId) {
        return participant;
      }
    }
  }

  public async getAllDirectActiveUser(userId: string) {
    const participants = await this.participantRepo.find(
      {
        relations: ['channel', 'channel.participants', 'channel.participants.user', 'user'],
        where: {
          channel: { direct: true},
          user: { id: userId },
        },
      }    
    );
    let dto = [];
    const blocks = await this.blockService.getArrayOfIdActiveUser(userId);
    for (const participant of participants) {
      const secondParticipant = this.getSecondParticipant(userId, participant.channel.participants);
      if (!blocks.includes(secondParticipant.user.id)) {
        const channelToDtoDirect = await this.channelToDtoDirectActiveUser(userId, participant.channel);
        dto.push(channelToDtoDirect);
      }
    }
    return dto;    
  }

  async findDirect(channelDirectCreationDto: ChannelDirectCreationDto) {
    const user1 = await this.userRepo.findOne(channelDirectCreationDto.userId1);
    const user2 = await this.userRepo.findOne(channelDirectCreationDto.userId2);
    const test1 = user1.name + "DirectTo" + user2.name;
    const test2 = user2.name + "DirectTo" + user1.name;
    const direct1 = await this.findByName(test1);;
    if (direct1) {
      return direct1;
    }
    const direct2 = await this.findByName(test2);
    if (direct2) {
      return direct2;
    } 
    return;
  }

  async goDirectActiveUser(channelDirectCreationDto: ChannelDirectCreationDto) {
    if (channelDirectCreationDto.userId1 === channelDirectCreationDto.userId2) {
      throw new HttpException('User can not create a direct Channel with himself', HttpStatus.BAD_REQUEST);      
    }
    let direct = await this.findDirect(channelDirectCreationDto);
    const blocks = await this.blockService.getArrayOfIdActiveUser(channelDirectCreationDto.userId1);
    if (direct && !blocks.includes(channelDirectCreationDto.userId2)) {
      return this.channelToDtoDirectActiveUser(channelDirectCreationDto.userId1, direct);
    }
    else if (!direct && !blocks.includes(channelDirectCreationDto.userId2)) {
      direct = await this.createDirect(channelDirectCreationDto);
      return this.channelToDtoDirectActiveUser(channelDirectCreationDto.userId1, direct);
    }
    else {
      throw new HttpException('There is a Block between those two users', HttpStatus.BAD_REQUEST);
    }
  }

  async goDirectActiveUserNoBlock(channelDirectCreationDto: ChannelDirectCreationDto) {
    if (channelDirectCreationDto.userId1 === channelDirectCreationDto.userId2) {
      throw new HttpException('User can not create a direct Channel with himself', HttpStatus.BAD_REQUEST);      
    }
    let direct = await this.findDirect(channelDirectCreationDto);
    if (direct) {
      return this.channelToDtoDirectActiveUser(channelDirectCreationDto.userId1, direct);
    }
    else if (!direct) {
      direct = await this.createDirect(channelDirectCreationDto);
      return this.channelToDtoDirectActiveUser(channelDirectCreationDto.userId1, direct);
    }
  }

  // <------------- FUNCTIONS CHANNEL TO DTO ------------->

  public async channelToDto(channel: Channel) {
    let dto = new ChannelDto();
    dto.id = channel.id;
    dto.name = channel.name;
    dto.status = ChannelStatus[channel.status]; 
    dto.ownerId = channel.owner.id;
    dto.ownerName = channel.owner.name;
    dto.nParticipants = 0;
    dto.participants = [];
    for (const participant of channel.participants) {
      if (!participant.left) {
        dto.nParticipants += 1;
      }
      let channelDto = new ParticipantForChannelDto();
      channelDto.id = participant.id;
      const participantObject = await this.participantService.findByIdUser(participant.id);
      channelDto.userId = participantObject.user.id;
      channelDto.userName = participantObject.user.name;
      channelDto.authorized = participant.authorized;
      channelDto.admin = participant.admin;
      channelDto.mute = participant.mute;
      channelDto.muteEndDateTime = participant.muteEndDateTime;
      channelDto.ban = participant.ban;
      channelDto.banEndDateTime = participant.banEndDateTime;
      channelDto.left = participant.left;
      dto.participants.push(channelDto);
    }
    return dto;
  }

  public async channelToDtoActiveUser(userId: string, channel: Channel) {
    let dto = new ChannelDtoActiveUser();
    dto.id = channel.id;
    dto.name = channel.name;
    dto.status = ChannelStatus[channel.status]; 
    dto.ownerId = channel.owner.id;
    dto.ownerName = channel.owner.name;
    dto.nParticipants = 0;
    for (const participant of channel.participants) {
      if (!participant.left) {
        dto.nParticipants += 1;
      }
    }
    if (await this.participantService.isParticipant(userId, channel.id)) {
      const participantActiveUser = await this.participantService.findByUserAndChannel(userId, channel.id);
      dto.activeUserParticipant = true;
      dto.activeUserAuthorized = participantActiveUser.authorized;
      dto.activeUserAdmin = participantActiveUser.admin;
      dto.activeUserMute = participantActiveUser.mute;
      dto.activeUserMuteEndDateTime = participantActiveUser.muteEndDateTime;
      dto.activeUserBan = participantActiveUser.ban;
      dto.activeUserBanEndDateTime = participantActiveUser.banEndDateTime;
      dto.activeUserLeft = participantActiveUser.left;
    }
    else {
      dto.activeUserParticipant = false;
      dto.activeUserAuthorized = null;
      dto.activeUserAdmin = null;
      dto.activeUserMute = null;
      dto.activeUserMuteEndDateTime = null;
      dto.activeUserBan = null;
      dto.activeUserBanEndDateTime = null;
      dto.activeUserLeft = null;
    }
    return dto;
  }

  public channelToDtoLazy(channel: Channel) {
    let dto = new ChannelDtoLazy();
    dto.id = channel.id;
    dto.name = channel.name;
    dto.status = ChannelStatus[channel.status];
    dto.ownerId = channel.owner.id;
    dto.ownerName = channel.owner.name;
    return dto;
  }

  public channelToDtoDirectActiveUser(userId, channel: Channel) {
    let dto = new ChannelDtoDirect();
    dto.id = channel.id;
    dto.name = this.getSecondParticipant(userId, channel.participants).user.name;
    dto.participants = [];
    for (const participant of channel.participants) {
      let channelDto = new ParticipantForChannelDirectDto();
      channelDto.id = participant.id;
      channelDto.userId = participant.user.id;
      channelDto.userName = participant.user.name;
      dto.participants.push(channelDto);
    }
    return dto;
  }

  id: string;
  name: string;
  email: string;
  avatar: string;

  public candidateToDto(participant: Participant) {
    let dto = new CandidateDto();
    dto.id = participant.user.id;
    dto.name = participant.user.name;
    dto.email = participant.user.email;
    dto.avatar = participant.user.avatar;
    return dto;
  }

  public candidateToDto2(user: User) {
    let dto = new CandidateDto();
    dto.id = user.id;
    dto.name = user.name;
    dto.email = user.email;
    dto.avatar = user.avatar;
    return dto;
  }
}
