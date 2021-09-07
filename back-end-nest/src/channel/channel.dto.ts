import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

import { ChannelStatus } from './enum.channelStatus';


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

export class ChannelSeedDto {
  name: string;
  status: ChannelStatus;
  ownerEmail: string;
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
}

export class AuthorizationDto {
  channelId: string;
  password: string;
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
}

export class ChannelDtoLazy {
  id: string;
  name: string;
  status: string;
  password: string;
  ownerId: string;
  ownerName: string;
}