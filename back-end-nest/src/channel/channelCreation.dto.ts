import { IsString, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ChannelStatus } from './enum.channelStatus';

export class ChannelCreationDto {
  @IsString()
  @IsNotEmpty()
  channelName: string;

  @IsEnum(ChannelStatus)
  channelStatus: ChannelStatus;

  @IsOptional()
  @IsString()
  @MinLength(7)
  password: string;

  @IsOptional()
  @IsString()
  ownerId: string;
}

export default ChannelCreationDto;
