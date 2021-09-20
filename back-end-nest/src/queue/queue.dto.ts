import { IsOptional } from 'class-validator';

import { GameDto } from '../game/game.dto';

export class QueueDto {
  id: string;
  queuerId: string;
  queuerName: string;
  queueTime: Date;
  gameId: string;
}

export class QueueUpdateDto {
  gameId: string;
}