import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';

import { Status } from './enum.status';
import { Level } from './enum.level';

import { ChannelForUserDto } from '../channel/channel.dto';
import { ParticipantForUserDto } from '../participant/participant.dto';


export class UserUpdateDto {
  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsEnum(Level)
  level: Level;

  @IsOptional()
  @IsInt()
  nGames: number;

  @IsOptional()
  @IsInt()
  nWins: number;

  @IsOptional()
  @IsInt()
  nLosses: number;

  @IsOptional()
  @IsInt()
  xp: number;
}

export class UserSeedDto {
  email: string;
  avatar: string;
  level: number;
  nGames: number;
  nWins: number;
  nLosses: number;
  xp: number;
}

export class UserDto {
  id: string;
  name: string;
  email: string;
  twoFactorAuthenticationSecret: string;
  isTwoFactorAuthenticationEnabled: boolean;
  avatar: string;
  status: string;
  level: string;
  nGames: number;
  nWins: number;
  nLosses: number;
  xp: number;
  channels: ChannelForUserDto[];
  participants: ParticipantForUserDto[];
}

export class UserForChannelDto {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export class UserForParticipantDto {
  id: string;
  name: string;
  email: string;
  avatar: string;
}