import { IsString, IsNotEmpty } from 'class-validator';

export class MessageCreationDto {
  @IsString()
  authorId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class MessageCreationActiveUserDto {
  @IsString()
  channelId: string;

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