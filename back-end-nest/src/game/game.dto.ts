import { GameStatus } from './enum.gameStatus';

export class GameUpdateDto {
  status: GameStatus;
}

export class GameDto {
  id: string;
  startTime: Date;
  status: string;
  //each player
}

export class GameDtoLazy {
  id: string;
  startTime: Date;
  status: string;
}