import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

import User from '../user/user.entity';

import { ChannelStatus } from './enum.channelStatus';

import { ParticipantForChannelDto } from '../participant/participant.dto';
import { ParticipantForChannelDirectDto } from '../participant/participant.dto';


export class ChannelCreationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ChannelStatus)
  status: ChannelStatus;

  @IsOptional()
  @IsString()
  @MinLength(7)
  password: string;

  @IsOptional()
  @IsString()
  ownerId: string;
}

export class ChannelDirectCreationDto {
  @IsString()
  userId1: string;

  @IsString()
  userId2: string;
}

export class ChannelSeedDto {
  name: string;
  status: ChannelStatus;
  password: string;
  ownerEmail: string;
}

export class ChannelDirectSeedDto {
  name1: string;
  name2: string;
}

export class ChannelUpdateDto {
  @IsOptional()
  @IsEnum(ChannelStatus)
  status: ChannelStatus;

  @IsOptional()
  @IsString()
  @MinLength(7)
  password: string;

  @IsOptional()
  @IsString()
  ownerId: string;

  @IsOptional()
  owner: User;
}

export class MuteBanDto {
  userId: string;
  channelId: string;
  always: boolean;

  @IsOptional()
  minutes: number;
}

export class AuthorizationDto {
  channelId: string;
  password: string;
}

export class ChannelDto {
  id: string;
  name: string;
  status: string;
  ownerId: string;
  ownerName: string;
  nParticipants: number;
  nUnreadMessages: number;
  participants: ParticipantForChannelDto[];
}

export class ChannelDtoActiveUser {
  id: string;
  name: string;
  status: string;
  ownerId: string;
  ownerName: string;
  nParticipants: number;
  nUnreadMessages: number;
  activeUserParticipant: boolean;
  activeUserAuthorized: boolean;
  activeUserAdmin: boolean;
  activeUserMute: boolean;
  activeUserMuteEndDateTime: Date; 
  activeUserBan: boolean;
  activeUserBanEndDateTime: Date;
  activeUserLeft: boolean;
}

export class ChannelDtoLazy {
  id: string;
  name: string;
  status: string;
  ownerId: string;
  ownerName: string;
}

export class ChannelDtoDirect {
  id: string;
  name: string;
  nUnreadMessages: number;
  participants: ParticipantForChannelDirectDto[];
}