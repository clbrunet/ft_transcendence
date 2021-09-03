import { GameStatus } from './enum.gameStatus';

import { PlayerForGameDto } from '../player/player.dto';

export class GameSeedDto {
  userEmail1: string;
  playerPoint1: number;
  userEmail2: string;
  playerPoint2: number;
  pointToVictory: number;
}

export class GameMatchDto {
  userEmail1: string;
  userEmail2: string;
  pointToVictory: number;
}

export class GameUpdateDto {
  status: GameStatus;
}

export class GameDto {
  id: string;
  startTime: Date;
  status: string;
  pointToVictory: number;
  players: PlayerForGameDto[];
}

export class GameDtoLazy {
  id: string;
  startTime: Date;
  status: string;
  pointToVictory: number;
}