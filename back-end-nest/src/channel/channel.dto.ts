import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';

import { ChannelStatus } from './enum.channelStatus';

import { ParticipantForChannelDto } from '../participant/participant.dto';
import { UserForChannelDto } from '../user/user.dto';


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
  password: string;
  ownerEmail: string;
}

export class ChannelDto {
  id: string;
  name: string;
  status: string;
  owner: UserForChannelDto;
  participants: ParticipantForChannelDto[];
}

export class ChannelForUserDto {
  id: string;
  name: string;
  status: string;
}

export class ChannelForParticipantDto {
  id: string;
  name: string;
}