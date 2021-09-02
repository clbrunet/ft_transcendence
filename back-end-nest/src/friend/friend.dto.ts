import { IsOptional } from 'class-validator';

import { FriendStatus } from './enum.friendStatus';

export class FriendCreationActiveUserDto {
  friendId: string;
}

export class FriendSeedDto {
  friendOwnerEmail: string;
  friendEmail: string;
  status: FriendStatus;
}

export class FriendUpdateActiveUserDto {
  friendId: string;

  @IsOptional()
  status: FriendStatus;
}

export class FriendUpdateDto {
  status: FriendStatus;
}

export class FriendDto {
  id: string;
  friendOwnerId: string;
  friendOwnerName: string;
  friendId: string;
  friendName: string;
  requestStatus: string;
  friendStatus: string;
}

export class FriendForUserDto {
  friendId: string;
  friendName: string;
  requestStatus: string;
  userStatus: string;
}