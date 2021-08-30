import { RegisterDto } from '../authentication/register.dto';
import { UserSeedDto } from '../user/user.dto';
import { FriendSeedDto } from '../friend/friend.dto';
import { ChannelSeedDto } from '../channel/channel.dto';
import { ParticipantSeedDto } from '../participant/participant.dto';
import { MessageSeedDto } from '../message/message.dto';


export const registers: RegisterDto[] = [
  { email: 'erwan@yopmail.com', name: 'Erwan', password: 'abcdefghi'},
  { email: 'clement@yopmail.com', name: 'Clement', password: 'abcdefghi'},
  { email: 'nicolas@yopmail.com', name: 'Nicolas', password: 'abcdefghi'},
  { email: 'lucille@yopmail.com', name: 'Lucille', password: 'abcdefghi'},
  { email: 'come@yopmail.com', name: 'Come', password: 'abcdefghi'},
  { email: 'alban@yopmail.com', name: 'Alban', password: 'abcdefghi'},
];

export const users: UserSeedDto[] = [
  { email: 'erwan@yopmail.com', avatar: '../Erwan.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'clement@yopmail.com', avatar: '../Clement.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'nicolas@yopmail.com', avatar: '../Nicolas.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'lucille@yopmail.com', avatar: '../Lucille.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'come@yopmail.com', avatar: '../Come.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'alban@yopmail.com', avatar: '../Alban.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
];

export const friends: FriendSeedDto[] = [
  { connectorEmail: 'erwan@yopmail.com', friendEmail: 'nicolas@yopmail.com', status: 0},
  { connectorEmail: 'erwan@yopmail.com', friendEmail: 'clement@yopmail.com', status: 2},
  { connectorEmail: 'erwan@yopmail.com', friendEmail: 'lucille@yopmail.com', status: 3},
  { connectorEmail: 'erwan@yopmail.com', friendEmail: 'alban@yopmail.com', status: 0},

  { connectorEmail: 'clement@yopmail.com', friendEmail: 'nicolas@yopmail.com', status: 2},
  { connectorEmail: 'clement@yopmail.com', friendEmail: 'lucille@yopmail.com', status: 3},
  { connectorEmail: 'clement@yopmail.com', friendEmail: 'alban@yopmail.com', status: 0},

  { connectorEmail: 'nicolas@yopmail.com', friendEmail: 'lucille@yopmail.com', status: 2},
  { connectorEmail: 'nicolas@yopmail.com', friendEmail: 'come@yopmail.com', status: 2},
  { connectorEmail: 'nicolas@yopmail.com', friendEmail: 'alban@yopmail.com', status: 2},
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

export const messages: MessageSeedDto[] = [
  { channelName: 'Karate budokai', userEmail: 'erwan@yopmail.com', content: 'Hello la team, ca va parler Karate ici!'},
  { channelName: 'Karate budokai', userEmail: 'nicolas@yopmail.com', content: 'Hate de parler Karate avec vous!'},
  { channelName: 'Karate budokai', userEmail: 'come@yopmail.com', content: 'J y connais rien au Karate moi!'},

  { channelName: 'I love Auth', userEmail: 'clement@yopmail.com', content: 'Je suis facile avec l Auth system!'},
  { channelName: 'I love Auth', userEmail: 'nicolas@yopmail.com', content: 'Je Craque je comprends rien!'},
  { channelName: 'I love Auth', userEmail: 'erwan@yopmail.com', content: 'API 42 c une tuerie!'},

  { channelName: 'La famille', userEmail: 'nicolas@yopmail.com', content: 'Hello les enfants!'},
  { channelName: 'La famille', userEmail: 'come@yopmail.com', content: 'Hello papa!'},
  { channelName: 'La famille', userEmail: 'lucille@yopmail.com', content: 'J ai faim!'},
  { channelName: 'La famille', userEmail: 'alban@yopmail.com', content: 'cnksndkcn;dkcn;sknc'},

  { channelName: 'Les bonnes recettes', userEmail: 'lucille@yopmail.com', content: 'On va bien manger grace aux recettes que je partagerai ici!'},
  { channelName: 'Les bonnes recettes', userEmail: 'erwan@yopmail.com', content: 'Miam!'},
  { channelName: 'Les bonnes recettes', userEmail: 'clement@yopmail.com', content: 'Miam!'},
  { channelName: 'Les bonnes recettes', userEmail: 'nicolas@yopmail.com', content: 'Miam!'},
  { channelName: 'Les bonnes recettes', userEmail: 'come@yopmail.com', content: 'Miam!'},
  { channelName: 'Les bonnes recettes', userEmail: 'alban@yopmail.com', content: 'nckdncklnsdlcnldn'},

  { channelName: 'Lego technics', userEmail: 'come@yopmail.com', content: 'On va construire le plus gros lego du monde grace a votre aide!'},
  { channelName: 'Lego technics', userEmail: 'erwan@yopmail.com', content: 'T inquiete de rien!'},
  { channelName: 'Lego technics', userEmail: 'clement@yopmail.com', content: 'C est OK!'},

  { channelName: 'Doudou & Cie', userEmail: 'alban@yopmail.com', content: 'dclksdlhsdlkhskl'},
  { channelName: 'Doudou & Cie', userEmail: 'lucille@yopmail.com', content: 'Doudou!'},
  { channelName: 'Doudou & Cie', userEmail: 'come@yopmail.com', content: 'Doudou!'},
];