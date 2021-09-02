import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { GameStatus } from './enum.gameStatus';

import User from '../user/user.entity';
import Player from '../player/player.entity';


@Entity()
class Game {
    @PrimaryGeneratedColumn('uuid')
    public id?: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    startTime: Date;

	@Column({ default: 0 })
  	public status: GameStatus;

	@OneToMany(() => Player, player => player.game)
  	players: Player[];
}

export default Game;