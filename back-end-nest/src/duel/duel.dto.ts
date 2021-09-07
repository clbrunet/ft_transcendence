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
}

export class DuelUpdateDto {
  status: DuelStatus;
}

export class DuelDto {
  id: string;
  duelOwnerId: string;
  duelOwnerName: string;
  duelId: string;
  duelName: string;
  status: string;
}