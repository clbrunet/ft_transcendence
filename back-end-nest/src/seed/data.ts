import { RegisterDto } from '../authentication/register.dto';
import { ChannelSeedDto } from '../channel/channel.dto';
import { ParticipantSeedDto } from '../participant/participant.dto';

export const registers: RegisterDto[] = [
  { email: 'erwan@yopmail.com', name: 'Erwan', password: 'abcdefghi'},
  { email: 'clement@yopmail.com', name: 'Clement', password: 'abcdefghi'},
  { email: 'nicolas@yopmail.com', name: 'Nicolas', password: 'abcdefghi'},
  { email: 'lucille@yopmail.com', name: 'Lucille', password: 'abcdefghi'},
  { email: 'come@yopmail.com', name: 'Come', password: 'abcdefghi'},
  { email: 'alban@yopmail.com', name: 'Alban', password: 'abcdefghi'},
];

export const channels: ChannelSeedDto[] = [
  { name: 'Karate budokai', status: 0, password: null, ownerEmail: 'erwan@yopmail.com'},
  { name: 'I love Auth', status: 0, password: null, ownerEmail: 'clement@yopmail.com'},
  { name: 'La famille', status: 0, password: null, ownerEmail: 'nicolas@yopmail.com'},
  { name: 'Les bonnes recettes', status: 0, password: null, ownerEmail: 'lucille@yopmail.com'},
  { name: 'Lego technics', status: 0, password: null, ownerEmail: 'come@yopmail.com'},
  { name: 'Doudou & Cie', status: 0, password: null, ownerEmail: 'alban@yopmail.com'},
];

export const participants: ParticipantSeedDto[] = [
  { channelName: 'Karate budokai', userEmail: 'erwan@yopmail.com', admin: true},
  { channelName: 'Karate budokai', userEmail: 'nicolas@yopmail.com', admin: false},
  { channelName: 'Karate budokai', userEmail: 'come@yopmail.com', admin: false},

  { channelName: 'I love Auth', userEmail: 'clement@yopmail.com', admin: true},
  { channelName: 'I love Auth', userEmail: 'nicolas@yopmail.com', admin: false},
  { channelName: 'I love Auth', userEmail: 'erwan@yopmail.com', admin: false},

  { channelName: 'La famille', userEmail: 'nicolas@yopmail.com', admin: true},
  { channelName: 'La famille', userEmail: 'come@yopmail.com', admin: false},
  { channelName: 'La famille', userEmail: 'lucille@yopmail.com', admin: false},
  { channelName: 'La famille', userEmail: 'alban@yopmail.com', admin: false},

  { channelName: 'Les bonnes recettes', userEmail: 'lucille@yopmail.com', admin: true},
  { channelName: 'Les bonnes recettes', userEmail: 'erwan@yopmail.com', admin: false},
  { channelName: 'Les bonnes recettes', userEmail: 'clement@yopmail.com', admin: false},
  { channelName: 'Les bonnes recettes', userEmail: 'nicolas@yopmail.com', admin: false},
  { channelName: 'Les bonnes recettes', userEmail: 'come@yopmail.com', admin: false},
  { channelName: 'Les bonnes recettes', userEmail: 'alban@yopmail.com', admin: false},

  { channelName: 'Lego technics', userEmail: 'come@yopmail.com', admin: true},
  { channelName: 'Lego technics', userEmail: 'erwan@yopmail.com', admin: false},
  { channelName: 'Lego technics', userEmail: 'clement@yopmail.com', admin: false},

  { channelName: 'Doudou & Cie', userEmail: 'alban@yopmail.com', admin: true},
  { channelName: 'Doudou & Cie', userEmail: 'lucille@yopmail.com', admin: false},
  { channelName: 'Doudou & Cie', userEmail: 'come@yopmail.com', admin: false},
];