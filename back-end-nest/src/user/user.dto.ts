import { IsString, IsInt, IsOptional, IsEnum, IsUUID } from 'class-validator';

import { Status } from './enum.status';
import { Level } from './enum.level';

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
