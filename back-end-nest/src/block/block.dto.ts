import { IsOptional } from 'class-validator';

import { BlockStatus } from './enum.blockStatus';

export class BlockCreationActiveUserDto {
  blockId: string;
}

export class BlockSeedDto {
  blockOwnerEmail: string;
  blockEmail: string;
  status: BlockStatus;
}

export class BlockUpdateActiveUserDto {
  blockId: string;

  @IsOptional()
  status: BlockStatus;
}

export class BlockUpdateDto {
  status: BlockStatus;
}

export class BlockDto {
  id: string;
  blockOwnerId: string;
  blockOwnerName: string;
  blockId: string;
  blockName: string;
  status: string;
}

export class BlockForUserDto {
  blockId: string;
  blockName: string;
  requestStatus: string;
  userStatus: string;
}