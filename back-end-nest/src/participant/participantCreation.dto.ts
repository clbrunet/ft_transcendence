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

export default ParticipantCreationDto;