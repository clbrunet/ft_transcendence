import { ChannelForUserDto } from '../channel/channel.dto';
import { ParticipantForUserDto } from '../participant/participant.dto';

export class UserDto {
  id: string;
  name: string;
  email: string;
  twoFactorAuthenticationSecret: string;
  isTwoFactorAuthenticationEnabled: boolean;
  avatar: string;
  status: string;
  level: string;
  nGames: number;
  nWins: number;
  nLosses: number;
  xp: number;
  channels: ChannelForUserDto[];
  participants: ParticipantForUserDto[];
}

export class UserForChannelDto {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export class UserForParticipantDto {
  id: string;
  name: string;
  email: string;
  avatar: string;
}