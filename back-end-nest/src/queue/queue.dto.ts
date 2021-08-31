/*import { IsOptional } from 'class-validator';

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
*/

export class QueueDto {
  id: string;
  queuerId: string;
  queuerName: string;
  queueTime: Date;
}
