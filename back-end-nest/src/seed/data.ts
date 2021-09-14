import { RegisterDto } from '../authentication/register.dto';
import { UserSeedDto } from '../user/user.dto';
import { FriendSeedDto } from '../friend/friend.dto';
import { BlockSeedDto } from '../block/block.dto';
import { DuelSeedDto } from '../duel/duel.dto';
import { GameSeedDto } from '../game/game.dto';
import { ChannelSeedDto } from '../channel/channel.dto';
import { ChannelDirectSeedDto } from '../channel/channel.dto';
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
  { email: 'erwan@yopmail.com', avatar: '../assets/erwan.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'clement@yopmail.com', avatar: '../assets/clement.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'nicolas@yopmail.com', avatar: '../assets/nicolas.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'lucille@yopmail.com', avatar: '../assets/lucille.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'come@yopmail.com', avatar: '../assets/come.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
  { email: 'alban@yopmail.com', avatar: '../assets/alban.png', level: 2, nGames: 20, nWins: 10, nLosses: 10, xp: 300},
];

// friend.status can't equal to 1, you invert connectorEmail and friendEmail if needed
export const friends: FriendSeedDto[] = [
  { friendOwnerEmail: 'erwan@yopmail.com', friendEmail: 'nicolas@yopmail.com', status: 2},
  { friendOwnerEmail: 'erwan@yopmail.com', friendEmail: 'clement@yopmail.com', status: 2},
  { friendOwnerEmail: 'erwan@yopmail.com', friendEmail: 'lucille@yopmail.com', status: 0},
  { friendOwnerEmail: 'erwan@yopmail.com', friendEmail: 'alban@yopmail.com', status: 0},

  { friendOwnerEmail: 'clement@yopmail.com', friendEmail: 'nicolas@yopmail.com', status: 2},
  { friendOwnerEmail: 'clement@yopmail.com', friendEmail: 'lucille@yopmail.com', status: 0},
  { friendOwnerEmail: 'clement@yopmail.com', friendEmail: 'alban@yopmail.com', status: 0},

  { friendOwnerEmail: 'nicolas@yopmail.com', friendEmail: 'lucille@yopmail.com', status: 2},
  { friendOwnerEmail: 'nicolas@yopmail.com', friendEmail: 'come@yopmail.com', status: 2},
  { friendOwnerEmail: 'nicolas@yopmail.com', friendEmail: 'alban@yopmail.com', status: 2},

  { friendOwnerEmail: 'come@yopmail.com', friendEmail: 'alban@yopmail.com', status: 2},
  { friendOwnerEmail: 'come@yopmail.com', friendEmail: 'lucille@yopmail.com', status: 2},
  { friendOwnerEmail: 'come@yopmail.com', friendEmail: 'erwan@yopmail.com', status: 0},
];

export const blocks: BlockSeedDto[] = [
  { blockOwnerEmail: 'erwan@yopmail.com', blockEmail: 'come@yopmail.com', status: 0},
  { blockOwnerEmail: 'clement@yopmail.com', blockEmail: 'come@yopmail.com', status: 0},
  { blockOwnerEmail: 'nicolas@yopmail.com', blockEmail: 'come@yopmail.com', status: 0},
  { blockOwnerEmail: 'alban@yopmail.com', blockEmail: 'come@yopmail.com', status: 0},
  { blockOwnerEmail: 'lucille@yopmail.com', blockEmail: 'come@yopmail.com', status: 0},
];

export const games: GameSeedDto[] = [
  { userEmail1: 'erwan@yopmail.com', playerPoint1: 3, userEmail2: 'nicolas@yopmail.com', playerPoint2: 5, pointToVictory: 5},
  { userEmail1: 'erwan@yopmail.com', playerPoint1: 2, userEmail2: 'clement@yopmail.com', playerPoint2: 5, pointToVictory: 5},
  { userEmail1: 'erwan@yopmail.com', playerPoint1: 1, userEmail2: 'lucille@yopmail.com', playerPoint2: 5, pointToVictory: 5},
  { userEmail1: 'erwan@yopmail.com', playerPoint1: 2, userEmail2: 'alban@yopmail.com', playerPoint2: 5, pointToVictory: 5},
  { userEmail1: 'erwan@yopmail.com', playerPoint1: 4, userEmail2: 'come@yopmail.com', playerPoint2: 5, pointToVictory: 5},

  { userEmail1: 'nicolas@yopmail.com', playerPoint1: 1, userEmail2: 'erwan@yopmail.com', playerPoint2: 3, pointToVictory: 3},
  { userEmail1: 'nicolas@yopmail.com', playerPoint1: 2, userEmail2: 'clement@yopmail.com', playerPoint2: 3, pointToVictory: 3},
  { userEmail1: 'nicolas@yopmail.com', playerPoint1: 1, userEmail2: 'lucille@yopmail.com', playerPoint2: 3, pointToVictory: 3},
  { userEmail1: 'nicolas@yopmail.com', playerPoint1: 2, userEmail2: 'alban@yopmail.com', playerPoint2: 3, pointToVictory: 3},
  { userEmail1: 'nicolas@yopmail.com', playerPoint1: 2, userEmail2: 'come@yopmail.com', playerPoint2: 3, pointToVictory: 3},

  { userEmail1: 'clement@yopmail.com', playerPoint1: 7, userEmail2: 'erwan@yopmail.com', playerPoint2: 8, pointToVictory: 8},
  { userEmail1: 'clement@yopmail.com', playerPoint1: 5, userEmail2: 'nicolas@yopmail.com', playerPoint2: 8, pointToVictory: 8},
  { userEmail1: 'clement@yopmail.com', playerPoint1: 4, userEmail2: 'lucille@yopmail.com', playerPoint2: 8, pointToVictory: 8},
  { userEmail1: 'clement@yopmail.com', playerPoint1: 1, userEmail2: 'alban@yopmail.com', playerPoint2: 8, pointToVictory: 8},
  { userEmail1: 'clement@yopmail.com', playerPoint1: 7, userEmail2: 'come@yopmail.com', playerPoint2: 8, pointToVictory: 8},

  { userEmail1: 'lucille@yopmail.com', playerPoint1: 7, userEmail2: 'erwan@yopmail.com', playerPoint2: 8, pointToVictory: 8},
  { userEmail1: 'lucille@yopmail.com', playerPoint1: 5, userEmail2: 'nicolas@yopmail.com', playerPoint2: 8, pointToVictory: 8},
  { userEmail1: 'lucille@yopmail.com', playerPoint1: 4, userEmail2: 'clement@yopmail.com', playerPoint2: 8, pointToVictory: 8},
  { userEmail1: 'lucille@yopmail.com', playerPoint1: 1, userEmail2: 'alban@yopmail.com', playerPoint2: 8, pointToVictory: 8},
  { userEmail1: 'lucille@yopmail.com', playerPoint1: 7, userEmail2: 'come@yopmail.com', playerPoint2: 8, pointToVictory: 8},

  { userEmail1: 'come@yopmail.com', playerPoint1: 1, userEmail2: 'erwan@yopmail.com', playerPoint2: 3, pointToVictory: 3},
  { userEmail1: 'come@yopmail.com', playerPoint1: 2, userEmail2: 'clement@yopmail.com', playerPoint2: 3, pointToVictory: 3},
  { userEmail1: 'come@yopmail.com', playerPoint1: 1, userEmail2: 'lucille@yopmail.com', playerPoint2: 3, pointToVictory: 3},
  { userEmail1: 'come@yopmail.com', playerPoint1: 2, userEmail2: 'alban@yopmail.com', playerPoint2: 3, pointToVictory: 3},
  { userEmail1: 'come@yopmail.com', playerPoint1: 2, userEmail2: 'nicolas@yopmail.com', playerPoint2: 3, pointToVictory: 3},
];

export const channels: ChannelSeedDto[] = [
  { name: 'Global Announcement', status: 0, password: null, ownerEmail: 'erwan@yopmail.com'},
  { name: 'Karate budokai', status: 1, password: null, ownerEmail: 'erwan@yopmail.com'},
  { name: 'I love Auth', status: 1, password: null, ownerEmail: 'clement@yopmail.com'},
  { name: 'La famille', status: 1, password: null, ownerEmail: 'nicolas@yopmail.com'},
  { name: 'Les bonnes recettes', status: 2, password: 'abcdefghi', ownerEmail: 'lucille@yopmail.com'},
  { name: 'Lego technics', status: 2, password: 'abcdefghi', ownerEmail: 'come@yopmail.com'},
  { name: 'Doudou & Cie', status: 2, password: 'abcdefghi', ownerEmail: 'alban@yopmail.com'},
];

export const participants: ParticipantSeedDto[] = [
  { channelName: 'Global Announcement', userEmail: 'nicolas@yopmail.com'},
  { channelName: 'Global Announcement', userEmail: 'clement@yopmail.com'},

  { channelName: 'Karate budokai', userEmail: 'nicolas@yopmail.com'},
  { channelName: 'Karate budokai', userEmail: 'come@yopmail.com'},

  { channelName: 'I love Auth', userEmail: 'nicolas@yopmail.com'},
  { channelName: 'I love Auth', userEmail: 'erwan@yopmail.com'},

  { channelName: 'La famille', userEmail: 'come@yopmail.com'},
  { channelName: 'La famille', userEmail: 'lucille@yopmail.com'},
  { channelName: 'La famille', userEmail: 'alban@yopmail.com'},

  { channelName: 'Les bonnes recettes', userEmail: 'erwan@yopmail.com' },
  { channelName: 'Les bonnes recettes', userEmail: 'clement@yopmail.com' },
  { channelName: 'Les bonnes recettes', userEmail: 'nicolas@yopmail.com' },
  { channelName: 'Les bonnes recettes', userEmail: 'come@yopmail.com' },
  { channelName: 'Les bonnes recettes', userEmail: 'alban@yopmail.com' },

  { channelName: 'Lego technics', userEmail: 'erwan@yopmail.com' },
  { channelName: 'Lego technics', userEmail: 'clement@yopmail.com' },

  { channelName: 'Doudou & Cie', userEmail: 'lucille@yopmail.com' },
  { channelName: 'Doudou & Cie', userEmail: 'come@yopmail.com' },
];

export const directs: ChannelDirectSeedDto[] = [
  { name1: 'Erwan', name2: 'Nicolas'},
  { name1: 'Erwan', name2: 'Clement'},

  { name1: 'Nicolas', name2: 'Lucille'},
  { name1: 'Nicolas', name2: 'Alban'},

  { name1: 'Clement', name2: 'Lucille'},
  { name1: 'Clement', name2: 'Alban'},

  { name1: 'Come', name2: 'Nicolas'},
  { name1: 'Come', name2: 'Clement'},
];

export const messages: MessageSeedDto[] = [
  { channelName: 'Global Announcement', userEmail: 'erwan@yopmail.com', content: 'Hello c ici pour les messages de services!'},
  { channelName: 'Global Announcement', userEmail: 'nicolas@yopmail.com', content: 'Le jeu est live! faites vous plaiz!'},
  { channelName: 'Global Announcement', userEmail: 'clement@yopmail.com', content: 'Feedbacks welcome!'},

  { channelName: 'Karate budokai', userEmail: 'erwan@yopmail.com', content: 'Hello la team, ca va parler Karate ici!'},
  { channelName: 'Karate budokai', userEmail: 'nicolas@yopmail.com', content: 'Hate de parler Karate avec vous!'},
  { channelName: 'Karate budokai', userEmail: 'come@yopmail.com', content: 'J y connais rien au Karate moi!'},

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

  { channelName: 'ErwanDirectToNicolas', userEmail: 'erwan@yopmail.com', content: 'Yo dude!'},
  { channelName: 'ErwanDirectToNicolas', userEmail: 'nicolas@yopmail.com', content: 'Hey!'},

  { channelName: 'ErwanDirectToClement', userEmail: 'erwan@yopmail.com', content: 'Yo dude!'},
  { channelName: 'ErwanDirectToClement', userEmail: 'clement@yopmail.com', content: 'Hey!'},

  { channelName: 'NicolasDirectToLucille', userEmail: 'nicolas@yopmail.com', content: 'Yo dude!'},
  { channelName: 'NicolasDirectToLucille', userEmail: 'lucille@yopmail.com', content: 'Hey!'},

  { channelName: 'NicolasDirectToAlban', userEmail: 'nicolas@yopmail.com', content: 'Yo dude!'},
  { channelName: 'NicolasDirectToAlban', userEmail: 'alban@yopmail.com', content: 'Hey!'},

  { channelName: 'ClementDirectToLucille', userEmail: 'clement@yopmail.com', content: 'Yo dude!'},
  { channelName: 'ClementDirectToLucille', userEmail: 'lucille@yopmail.com', content: 'Hey!'},

  { channelName: 'ClementDirectToAlban', userEmail: 'clement@yopmail.com', content: 'Yo dude!'},
  { channelName: 'ClementDirectToAlban', userEmail: 'alban@yopmail.com', content: 'Hey!'},

  { channelName: 'ComeDirectToNicolas', userEmail: 'come@yopmail.com', content: 'Yo dude!'},
  { channelName: 'ComeDirectToNicolas', userEmail: 'nicolas@yopmail.com', content: 'Hey!'},

  { channelName: 'ComeDirectToClement', userEmail: 'come@yopmail.com', content: 'Yo dude!'},
  { channelName: 'ComeDirectToClement', userEmail: 'clement@yopmail.com', content: 'Hey!'},
];