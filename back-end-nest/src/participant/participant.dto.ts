import { IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';

import { MessageForParticipantDto } from '../message/message.dto';

export class ParticipantCreationDto {
  @IsString()
  userId: string;

  @IsString()
  channelId: string;

  @IsOptional()
  @IsBoolean()
  authorized: boolean;

  @IsOptional()
  @IsBoolean()
  admin: boolean;
}

export class ParticipantSeedDto {
  userEmail: string;
  channelName: string;
}

export class ParticipantUpdateDto {
  @IsOptional()
  @IsBoolean()
  authorized: boolean;

  @IsOptional()
  @IsBoolean()
  admin: boolean;

  @IsOptional()
  @IsBoolean()
  mute: boolean;

  @IsOptional()
  @IsDate()
  muteEndDateTime: Date;

  @IsOptional()
  @IsBoolean()
  ban: boolean;

  @IsOptional()
  @IsDate()
  banEndDateTime: Date;

  @IsOptional()
  @IsBoolean()
  left: boolean;
}

export class ParticipantDto {
  id: string;
  userId: string;
  userName: string;
  channelId: string;
  channelName: string;
  authorized: boolean;
  admin: boolean;
  mute: boolean;
  muteEndDateTime: Date; 
  ban: boolean;
  banEndDateTime: Date;
  left: boolean;
  messages: MessageForParticipantDto[];
}

export class ParticipantForChannelDto {
  id: string;
  userId: string;
  userName: string;
  authorized: boolean;
  admin: boolean;
  mute: boolean;
  muteEndDateTime: Date; 
  ban: boolean;
  banEndDateTime: Date;
  left: boolean;
}