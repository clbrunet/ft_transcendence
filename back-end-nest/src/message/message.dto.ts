import { IsString, IsNotEmpty } from 'class-validator';

export class MessageCreationDto {
  @IsString()
  authorId: string; // Participant

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class MessageSeedDto {
  userEmail: string; // User
  channelName: string;
  content: string;
}

export class MessageCreationActiveUserDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class MessageDto {
  id: string;
  authorId: string;
  userId: string;
  userName: string;
  channelId: string;
  channelName: string;
  createDateTime: Date;
  content: string;
}

export class MessageForParticipantDto {
  id: string;
  createDateTime: Date;
  content: string;
}
