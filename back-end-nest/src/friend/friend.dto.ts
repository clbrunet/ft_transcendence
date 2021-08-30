import { IsOptional } from 'class-validator';

import { RequestStatus } from './enum.requestStatus';

export class FriendCreationActiveUserDto {
  friendId: string;
}

export class FriendSeedDto {
  connectorEmail: string;
  friendEmail: string;
  status: RequestStatus;
}

export class FriendUpdateActiveUserDto {
  friendId: string;

  @IsOptional()
  status: RequestStatus;
}

export class FriendUpdateDto {
  status: RequestStatus;
}

export class FriendDto {
  id: string;
  connectorId: string;
  connectorName: string;
  friendId: string;
  friendName: string;
  status: string;
}

export class FriendForUserDto {
  friendId: string;
  friendName: string;
  requestStatus: string;
  userStatus: string;
}