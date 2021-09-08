import { HttpException, HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import User from '../user/user.entity';
import Channel from '../channel/channel.entity';
import Participant from '../participant/participant.entity';

import { ChannelStatus } from './enum.channelStatus';

import { UserService } from '../user/user.service';
import { ParticipantService } from '../participant/participant.service';

import { ChannelCreationDto } from './channel.dto';
import { ParticipantCreationDto } from '../participant/participant.dto';
import { ChannelUpdateDto } from './channel.dto';
import { ParticipantUpdateDto } from '../participant/participant.dto';
import { AuthorizationDto } from './channel.dto';
import { MuteBanDto } from './channel.dto';
import { ChannelDto } from './channel.dto';
import { ParticipantForChannelDto } from '../participant/participant.dto';
import { ChannelDtoActiveUser } from './channel.dto';
import { ChannelDtoLazy } from './channel.dto';


@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepo: Repository<Channel>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly userService: UserService,
    @Inject(forwardRef(() => ParticipantService))
    private readonly participantService: ParticipantService,
  ) {}

  async create(channelCreationDto: ChannelCreationDto) {
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
    return this.channelToDtoLazy(newChannel);
  }

  // Return all Channel objects with all relations and joined tables
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

  // Return all Channels Dto without any relation
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

  // Return Channel object with all relations and joined tables
  public async findById(id: string, direct: boolean) {
    const channel = await this.channelRepo.findOne(id,
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
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this (id, direct) does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel object with no relation but joined tables
  public async findByIdOwner(id: string, direct: boolean) {
    const channel = await this.channelRepo.findOne(id,
      {
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
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this (id, direct) does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel object with no relation but joined tables
  public async findByIdOwnerBoth(id: string) {
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
    throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel Object without any relations nor joined tables
  public async findByIdLazy(id: string, direct: boolean) {
    const channel = await this.channelRepo.findOne(id,
      {
        where: {
          direct: direct,
        },
      }
    );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this (id, direct) does not exist', HttpStatus.NOT_FOUND);
  } 

  // Return Channel Object without any relations nor joined tables
  public async findByIdLazyBoth(id: string) {
    const channel = await this.channelRepo.findOne(id);
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this (id, direct) does not exist', HttpStatus.NOT_FOUND);
  } 

  // Return Channel Object without any relation nor joined table
  public async findByNameLazy(name: string) {
    const channel = await this.channelRepo.findOne( { name },
      {
        where: {
          direct: false,
        },
      }
    );
    if (channel) {
      return channel;
    }
    throw new HttpException('Channel with this (name, direct)  does not exist', HttpStatus.NOT_FOUND);
  }

  // Return Channel dto
  public async getById(id: string) {
    const channel = await this.findById(id, false);
    return await this.channelToDto(channel);
  } 

  public async update(id: string, channelUpdateDto: ChannelUpdateDto) {
    const res = await this.channelRepo.update(id, channelUpdateDto);
    if (res) {
      return this.channelToDtoLazy(await this.findByIdLazyBoth(id));
    }
    throw new HttpException('Channel update failed', HttpStatus.NOT_FOUND);
  }

  public async changeOwnerActiveUser(userId: string, id: string, newOwnerId: string) {
    const channel = await this.findByIdOwner(id, false);
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
      return this.channelToDtoLazy(await this.findByIdOwner(id, false));
    }
    throw new HttpException('Channel update failed', HttpStatus.NOT_FOUND);
  }

  public async changeStatusActiveUser(userId: string, id: string, channelUpdateDto: ChannelUpdateDto) {
    const channel = await this.findById(id, false);
    if (channel.owner.id !== userId) {
      throw new HttpException('User is not the Channel owner', HttpStatus.NOT_FOUND);
    }
    if (channelUpdateDto.status === 0 || channelUpdateDto.status === 1) {
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

  public async addAdminActiveUser(userId: string, id: string, newAdminId: string) {
    const channel = await this.findByIdOwner(id, false);
    if (channel.owner.id !== userId) {
      throw new HttpException('User is not the Channel owner', HttpStatus.NOT_FOUND);
    }
    if (!await this.participantService.isParticipant(newAdminId, id)) {
      throw new HttpException('New admin is not a Participant of this Channel', HttpStatus.NOT_FOUND);
    }
    const newAdmin = await this.participantService.findByUserAndChannelLazy(newAdminId, id);
    return await this.participantService.updateAdmin(newAdmin.id, true);
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
    const channel = await this.findByIdLazy(muteBanDto.channelId, false);
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
    const channel = await this.findByIdLazy(authorizationDto.channelId, false);
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
    const channel = await this.findByIdOwner(id, false);
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
      await this.findByIdLazyBoth(id);
    }
    catch(error) {
      throw new HttpException('Channel with this id does not exist', HttpStatus.NOT_FOUND);
    }
    await this.channelRepo.delete(id);
    return "Successful Channel deletion";
  }

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
    dto.nUnreadMessages = 0;
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
    dto.nUnreadMessages = 0;
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
}
