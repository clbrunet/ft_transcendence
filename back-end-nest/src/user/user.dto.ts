import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';

import { Status } from './enum.status';
import { Level } from './enum.level';

import { ChannelForUserDto } from '../channel/channel.dto';
import { ParticipantForUserDto } from '../participant/participant.dto';
import { FriendForUserDto } from '../friend/friend.dto';
import { BlockForUserDto } from '../block/block.dto';
import { DuelForUserDto } from '../duel/duel.dto';


export class UserUpdateDto {
  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;

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

export class UserDtoLazy {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: string;
  nGames: number;
  nWins: number;
  nLosses: number;
  xp: number;
}

export class ActiveUserDto {
  id: string;
  name: string;
  email: string;
  isTwoFactorAuthenticationEnabled: boolean;
  avatar: string;
  status: string;
  level: string;
  nGames: number;
  nWins: number;
  nLosses: number;
  xp: number;
  inQueue: boolean;
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