import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class ParticipantCreationDto {
  @IsString()
  userId: string;

  @IsString()
  channelId: string;

  @IsOptional()
  @IsBoolean()
  admin: boolean;
}

export class ParticipantForChannelDto {
  id: string;
  name: string;
  admin: boolean;
  mute: boolean;
  ban: boolean;
}

export class ParticipantForUserDto {
  channelId: string;
  channelName: string;
  admin: boolean;
  mute: boolean;
  ban: boolean;
}
