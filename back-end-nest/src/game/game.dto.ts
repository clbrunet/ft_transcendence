import { IsOptional } from 'class-validator';

import { GameStatus } from './enum.gameStatus';

import { PlayerForGameDto } from '../player/player.dto';

export class GameSeedDto {
  userEmail1: string;
  playerPoint1: number;
  userEmail2: string;
  playerPoint2: number;
  pointToVictory: number;
  ballSize: number;
  ballSpeed: number;
}

export class GameMatchDto {
  userId1: string;
  userId2: string;
  pointToVictory: number;
  ballSize: number;
  ballSpeed: number;
}

export class GameUpdateDto {
  @IsOptional()
  pointToVictory: number;

  @IsOptional()
  ballSize: number;

  @IsOptional()
  ballSpeed: number;

  @IsOptional()
  status: GameStatus;
}

export class GameDto {
  id: string;
  startTime: Date;
  status: string;
  pointToVictory: number;
  ballSize: number;
  ballSpeed: number;
  players: PlayerForGameDto[];
}

export class GameHistoryDto {
  id: string;
  startTime: Date;
  status: string;
  pointToVictory: number;
  ballSize: number;
  ballSpeed: number;
  winnerName: string;
  winnerPoint: number;
  loserName: string;
  loserPoint: number;
}

export class GameDtoLazy {
  id: string;
  startTime: Date;
  status: string;
  pointToVictory: number;
  ballSize: number;
  ballSpeed: number;
}

export class ScoreDto {
  outcome: string;
  gameDto: GameDto;
}