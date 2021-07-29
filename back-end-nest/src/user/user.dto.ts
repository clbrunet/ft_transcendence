import ChannelDto from '../channel/channel.dto';

export class UserDto {
  userId: string;
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
  channels: ChannelDto[];
}

export default UserDto;
