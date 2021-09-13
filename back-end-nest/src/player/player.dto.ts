export class PlayerCreationDto {
  userId: string;
  gameId: string;
}

export class PlayerUpdateDto {
  point: number;
}

export class PlayerDto {
  id: string;
  userId: string;
  userName: string;
  gameId: string;
  point: number;
}

export class PlayerForGameDto {
  id: string;
  userId: string;
  userName: string;
  point: number;
}