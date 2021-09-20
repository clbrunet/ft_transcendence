import { IsOptional } from 'class-validator';

import { DuelStatus } from './enum.duelStatus';

export class DuelCreationActiveUserDto {
  duelId: string;
}

export class DuelSeedDto {
  duelOwnerEmail: string;
  duelEmail: string;
  status: DuelStatus;
}

export class DuelUpdateActiveUserDto {
  duelId: string;

  @IsOptional()
  status: DuelStatus;

  @IsOptional()
  gameId: string;
}

export class DuelUpdateDto {
  @IsOptional()
  status: DuelStatus;

  @IsOptional()
  gameId: string;
}

export class DuelDto {
  id: string;
  duelOwnerId: string;
  duelOwnerName: string;
  duelId: string;
  duelName: string;
  status: string;
  gameId: string;
}