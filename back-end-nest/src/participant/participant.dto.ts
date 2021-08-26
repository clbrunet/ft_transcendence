import { IsString, IsBoolean, IsOptional } from 'class-validator';

import { MessageForParticipantDto } from '../message/message.dto';

export class ParticipantCreationDto {
  @IsString()
  userId: string;

  @IsString()
  channelId: string;

  @IsOptional()
  @IsBoolean()
  admin: boolean;
}

export class ParticipantDto {
  id: string;
  userId: string;
  userName: string;
  channelId: string;
  channelName: string;
  admin: boolean;
  mute: boolean;
  muteDateTime: Date; 
  ban: boolean;
  banDateTime: Date;
  messages: MessageForParticipantDto[];
}

export class ParticipantForChannelDto {
  id: string;
  name: string;
  admin: boolean;
  mute: boolean;
  muteDateTime: Date; 
  ban: boolean;
  banDateTime: Date;
}

export class ParticipantForUserDto {
  channelId: string;
  channelName: string;
  admin: boolean;
  mute: boolean;
  muteDateTime: Date; 
  ban: boolean;
  banDateTime: Date;
}
