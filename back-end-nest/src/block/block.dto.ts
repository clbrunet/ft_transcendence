export class BlockCreationActiveUserDto {
  blockId: string;
}

export class BlockSeedDto {
  blockConnectorEmail: string;
  blockEmail: string;
}

export class BlockDto {
  id: string;
  blockConnectorId: string;
  blockConnectorName: string;
  blockId: string;
  blockName: string;
}

export class BlockForUserDto {
  blockId: string;
  blockName: string;
}